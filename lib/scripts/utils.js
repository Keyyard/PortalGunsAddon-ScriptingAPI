import { system } from "@minecraft/server";
function teleportToLinkedPortal(player, portalEntity, targetPortalType) {
    portalEntity.dimension.getEntities({ location: portalEntity.location }).forEach((linkedEntity) => {
        if (linkedEntity.typeId === targetPortalType) {
            // eslint-disable-next-line minecraft-linting/avoid-unnecessary-command
            player.runCommand("/camera @s fade time 0.5 1 0.5");
            player.runCommand("/gamerule sendcommandfeedback false");
            system.runTimeout(() => {
                const { x, y, z } = linkedEntity.location;
                player.setDynamicProperty("playerTpHolder", 1);
                player.teleport({ x, y: y + 1, z });
            }, 20);
        }
    });
}
export { teleportToLinkedPortal };
//# sourceMappingURL=utils.js.map