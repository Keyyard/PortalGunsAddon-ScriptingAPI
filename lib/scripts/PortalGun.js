import { system } from "@minecraft/server";
import { Vector3Utils } from "@minecraft/math";
export class Guns {
    static PortalGun() {
        return new PortalGunScript();
    }
}
class PortalGunScript extends Guns {
    usePortalGun(source, color) {
        return __awaiter(this, void 0, void 0, function* () {
            const portalType = color === "red" ? "keyyard:portal_red" : "keyyard:portal_blue";
            const particleType = color === "red" ? "minecraft:stalactite_lava_drip_particle" : "minecraft:stalactite_water_drip_particle";
            source.dimension.playSound("cake.add_candle", source.location);
            source.dimension.spawnParticle("keyyard:portal_gun_shoot", Vector3Utils.add(source.getHeadLocation(), Vector3Utils.multiply(source.getViewDirection(), { x: 1, y: 1.5, z: 1.5 })));
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
            yield system.waitTicks(Math.ceil(distance * 0.1));
            switch (color) {
                case "red":
                case "blue":
                    source.dimension.getEntities({ type: portalType }).forEach((entity) => entity.remove());
            }
            const { x, y, z } = target.location;
            if (source.getViewDirection().y > 0.5 || source.getViewDirection().y < -0.5) {
                //eslint-disable-next-line minecraft-linting/avoid-unnecessary-command
                source.runCommand(`/summon ${portalType} ${x} ${y} ${z} facing ${source.nameTag} keyyard:lays`);
            }
            else {
                //eslint-disable-next-line minecraft-linting/avoid-unnecessary-command
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
        });
    }
    useBluePortalGun(source) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usePortalGun(source, "blue");
        });
    }
    useRedPortalGun(source, itemStack) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usePortalGun(source, "red");
        });
    }
}
//# sourceMappingURL=PortalGun.js.map