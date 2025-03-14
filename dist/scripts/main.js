// scripts/main.ts
import { Player as Player3, system as system3, world as world2 } from "@minecraft/server";

// scripts/PortalGun.ts
import { system } from "@minecraft/server";

// node_modules/@minecraft/math/lib/general/clamp.js
function clampNumber(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// node_modules/@minecraft/math/lib/vector3/coreHelpers.js
var Vector3Utils = class _Vector3Utils {
  /**
   * equals
   *
   * Check the equality of two vectors
   */
  static equals(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }
  /**
   * add
   *
   * Add two vectors to produce a new vector
   */
  static add(v1, v2) {
    return { x: v1.x + (v2.x ?? 0), y: v1.y + (v2.y ?? 0), z: v1.z + (v2.z ?? 0) };
  }
  /**
   * subtract
   *
   * Subtract two vectors to produce a new vector (v1-v2)
   */
  static subtract(v1, v2) {
    return { x: v1.x - (v2.x ?? 0), y: v1.y - (v2.y ?? 0), z: v1.z - (v2.z ?? 0) };
  }
  /** scale
   *
   * Multiple all entries in a vector by a single scalar value producing a new vector
   */
  static scale(v1, scale) {
    return { x: v1.x * scale, y: v1.y * scale, z: v1.z * scale };
  }
  /**
   * dot
   *
   * Calculate the dot product of two vectors
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  /**
   * cross
   *
   * Calculate the cross product of two vectors. Returns a new vector.
   */
  static cross(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }
  /**
   * magnitude
   *
   * The magnitude of a vector
   */
  static magnitude(v) {
    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  }
  /**
   * distance
   *
   * Calculate the distance between two vectors
   */
  static distance(a, b) {
    return _Vector3Utils.magnitude(_Vector3Utils.subtract(a, b));
  }
  /**
   * normalize
   *
   * Takes a vector 3 and normalizes it to a unit vector
   */
  static normalize(v) {
    const mag = _Vector3Utils.magnitude(v);
    return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
  }
  /**
   * floor
   *
   * Floor the components of a vector to produce a new vector
   */
  static floor(v) {
    return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
  }
  /**
   * toString
   *
   * Create a string representation of a vector3
   */
  static toString(v, options) {
    const decimals = options?.decimals ?? 2;
    const str = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
    return str.join(options?.delimiter ?? ", ");
  }
  /**
   * clamp
   *
   * Clamps the components of a vector to limits to produce a new vector
   */
  static clamp(v, limits) {
    return {
      x: clampNumber(v.x, limits?.min?.x ?? Number.MIN_SAFE_INTEGER, limits?.max?.x ?? Number.MAX_SAFE_INTEGER),
      y: clampNumber(v.y, limits?.min?.y ?? Number.MIN_SAFE_INTEGER, limits?.max?.y ?? Number.MAX_SAFE_INTEGER),
      z: clampNumber(v.z, limits?.min?.z ?? Number.MIN_SAFE_INTEGER, limits?.max?.z ?? Number.MAX_SAFE_INTEGER)
    };
  }
  /**
   * lerp
   *
   * Constructs a new vector using linear interpolation on each component from two vectors.
   */
  static lerp(a, b, t) {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t
    };
  }
  /**
   * slerp
   *
   * Constructs a new vector using spherical linear interpolation on each component from two vectors.
   */
  static slerp(a, b, t) {
    const theta = Math.acos(_Vector3Utils.dot(a, b));
    const sinTheta = Math.sin(theta);
    const ta = Math.sin((1 - t) * theta) / sinTheta;
    const tb = Math.sin(t * theta) / sinTheta;
    return _Vector3Utils.add(_Vector3Utils.scale(a, ta), _Vector3Utils.scale(b, tb));
  }
  /**
   * multiply
   *
   * Element-wise multiplication of two vectors together.
   * Not to be confused with {@link Vector3Utils.dot} product or {@link Vector3Utils.cross} product
   */
  static multiply(a, b) {
    return {
      x: a.x * b.x,
      y: a.y * b.y,
      z: a.z * b.z
    };
  }
  /**
   * rotateX
   *
   * Rotates the vector around the x axis counterclockwise (left hand rule)
   * @param a - Angle in radians
   */
  static rotateX(v, a) {
    let cos = Math.cos(a);
    let sin = Math.sin(a);
    return {
      x: v.x,
      y: v.y * cos - v.z * sin,
      z: v.z * cos + v.y * sin
    };
  }
  /**
   * rotateY
   *
   * Rotates the vector around the y axis counterclockwise (left hand rule)
   * @param a - Angle in radians
   */
  static rotateY(v, a) {
    let cos = Math.cos(a);
    let sin = Math.sin(a);
    return {
      x: v.x * cos + v.z * sin,
      y: v.y,
      z: v.z * cos - v.x * sin
    };
  }
  /**
   * rotateZ
   *
   * Rotates the vector around the z axis counterclockwise (left hand rule)
   * @param a - Angle in radians
   */
  static rotateZ(v, a) {
    let cos = Math.cos(a);
    let sin = Math.sin(a);
    return {
      x: v.x * cos - v.y * sin,
      y: v.y * cos + v.x * sin,
      z: v.z
    };
  }
};

// scripts/PortalGun.ts
var Guns = class {
  static PortalGun() {
    return new PortalGunScript();
  }
};
var PortalGunScript = class extends Guns {
  async usePortalGun(source, color) {
    const portalType = color === "red" ? "keyyard:portal_red" : "keyyard:portal_blue";
    const particleType = color === "red" ? "minecraft:stalactite_lava_drip_particle" : "minecraft:stalactite_water_drip_particle";
    source.dimension.playSound("cake.add_candle", source.location);
    source.dimension.spawnParticle(
      "keyyard:portal_gun_shoot",
      Vector3Utils.add(
        source.getHeadLocation(),
        Vector3Utils.multiply(source.getViewDirection(), { x: 1, y: 1.5, z: 1.5 })
      )
    );
    const result = source.getBlockFromViewDirection({ maxDistance: 100 });
    if (!result)
      return;
    const target = result.block;
    const distance = Vector3Utils.distance(source.location, target);
    system.run(() => {
      if (!source.isValid())
        return;
      const steps = distance * 2;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const point = Vector3Utils.lerp(source.getHeadLocation(), target, t);
        source.dimension.spawnParticle(particleType, point);
      }
    });
    await system.waitTicks(Math.ceil(distance * 0.1));
    switch (color) {
      case "red":
      case "blue":
        source.dimension.getEntities({ type: portalType }).forEach((entity) => entity.remove());
    }
    const { x, y, z } = target.location;
    if (source.getViewDirection().y > 0.5 || source.getViewDirection().y < -0.5) {
      source.runCommand(`/summon ${portalType} ${x} ${y} ${z} facing ${source.nameTag} keyyard:lays`);
    } else {
      source.runCommand(`/summon ${portalType} ${x} ${y} ${z} facing ${source.nameTag}`);
    }
    let defaultGun = source.getDynamicProperty(`defaultGun`);
    switch (portalType) {
      case `keyyard:portal_blue`:
        source.dimension.spawnParticle(`keyyard:portal_summon_blue`, target.location);
        source.setDynamicProperty(`defaultGun`, `red`);
        break;
      case `keyyard:portal_red`:
        source.dimension.spawnParticle(`keyyard:portal_summon_red`, target.location);
        source.setDynamicProperty(`defaultGun`, `blue`);
        break;
    }
  }
  async useBluePortalGun(source) {
    await this.usePortalGun(source, "blue");
  }
  async useRedPortalGun(source, itemStack) {
    await this.usePortalGun(source, "red");
  }
};

// scripts/utils.ts
import { system as system2 } from "@minecraft/server";
function teleportToLinkedPortal(player, portalEntity, targetPortalType) {
  portalEntity.dimension.getEntities({ location: portalEntity.location }).forEach((linkedEntity) => {
    if (linkedEntity.typeId === targetPortalType) {
      player.runCommand("/camera @s fade time 0.5 1 0.5");
      player.runCommand("/gamerule sendcommandfeedback false");
      system2.runTimeout(() => {
        const { x, y, z } = linkedEntity.location;
        player.setDynamicProperty("playerTpHolder", 1);
        player.teleport({ x, y: y + 1, z });
      }, 20);
    }
  });
}

// scripts/main.ts
system3.runInterval(() => {
  world2.getAllPlayers().forEach((player) => {
    const defaultGun = player.getDynamicProperty(`defaultGun`) || `red`;
    const inventory = player.getComponent("minecraft:inventory");
    const selectedSlot = player.selectedSlotIndex;
    const handItem = inventory?.container?.getItem(selectedSlot);
    if (handItem?.typeId === "keyyard:portal_gun") {
      switch (defaultGun) {
        case "red":
          player.onScreenDisplay.setActionBar(`Current Portal Mode \xA7c\xA7l[Red]`);
          break;
        case "blue":
          player.onScreenDisplay.setActionBar(`Current Portal Mode \xA7b\xA7l[Blue]`);
          break;
      }
    }
  });
});
world2.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
  if (!(source instanceof Player3)) {
    return;
  }
  let defaultGun = source.getDynamicProperty(`defaultGun`);
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
});
system3.runInterval(() => {
  world2.getAllPlayers().forEach((player) => {
    let playerTpHolder = player.getDynamicProperty("playerTpHolder") || 0;
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

//# sourceMappingURL=../debug/main.js.map
