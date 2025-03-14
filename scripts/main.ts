import {
  Player,
  system,
  world,
  EntityInventoryComponent,
  EntityEquippableComponent,
  EquipmentSlot,
} from "@minecraft/server";
import { Guns } from "./PortalGun";
import { teleportToLinkedPortal } from "./utils";

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {
    const defaultGun = (player.getDynamicProperty(`defaultGun`) as string) || `red`;

    const inventory = player.getComponent("minecraft:inventory") as EntityInventoryComponent;
    const selectedSlot = player.selectedSlotIndex;
    const handItem = inventory?.container?.getItem(selectedSlot);

    if (handItem?.typeId === "keyyard:portal_gun") {
      switch (defaultGun) {
        case "red":
          player.onScreenDisplay.setActionBar(`Current Portal Mode §c§l[Red]`);
          break;
        case "blue":
          player.onScreenDisplay.setActionBar(`Current Portal Mode §b§l[Blue]`);
          break;
      }
    }
  });
});

world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
  let playerHeld = (source.getComponent(`equippable`) as EntityEquippableComponent).getEquipment(
    EquipmentSlot.Mainhand
  );
  if (playerHeld?.typeId == "keyyard:portal_gun") {
    if (!(source instanceof Player)) {
      return;
    }

    let defaultGun = source.getDynamicProperty(`defaultGun`) as string;
    if (!defaultGun) {
      source.setDynamicProperty(`defaultGun`, `red`);
      defaultGun = `red`;
    }
    switch (defaultGun) {
      case "red": {
        Guns.PortalGun().useRedPortalGun(source, itemStack);
        break;
      }
      case "blue": {
        Guns.PortalGun().useBluePortalGun(source);
        break;
      }
    }
  }
});

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {
    let playerTpHolder = (player.getDynamicProperty("playerTpHolder") as number) || 0;
    player.dimension.getEntities({ maxDistance: 2, location: player.location }).forEach((entity) => {
      if (playerTpHolder == 0) {
        switch (entity.typeId) {
          case "keyyard:portal_red": {
            teleportToLinkedPortal(player, entity, "keyyard:portal_blue");
            break;
          }
          case "keyyard:portal_blue": {
            teleportToLinkedPortal(player, entity, "keyyard:portal_red");
            break;
          }
        }
      }
      if (playerTpHolder === 6) {
        player.playSound("mob.endermen.portal");
      }
      if (playerTpHolder > 0 && playerTpHolder <= 60) {
        player.setDynamicProperty("playerTpHolder", playerTpHolder + 1);
      }
      if (playerTpHolder > 60) {
        player.setDynamicProperty("playerTpHolder", 0);
      }
    });
  });
}, 1);
