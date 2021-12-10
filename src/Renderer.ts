import {
    Animation,
    AtlasSprite,
    Audio,
    Button,
    Entity,
    Group,
    Image,
    Line,
    Rectangle,
    Sprite,
    Text,
    TextureSprite,
    World
} from "../mod.ts";
import { hexToRGBA } from "./utils/mod.ts";

export class Renderer {

    constructor(public world: World) {}
    
    public render(entity: Entity) {
        if (entity instanceof Rectangle) {
            this.world.setDrawColor(
              entity.fill[0],
              entity.fill[1],
              entity.fill[2],
              entity.fill[3],
            );
            this.world.fillRect(entity.x, entity.y, entity.width, entity.height);
          } else if (entity instanceof Line) {
            this.world.drawLine(entity.p1, entity.p2);
          } else if (entity instanceof Image) {
            this.world.copy(
              entity.texture,
              {
                x: 0,
                y: 0,
                width: entity.width,
                height: entity.height,
              },
              {
                x: entity.x,
                y: entity.y,
                width: entity.width,
                height: entity.height,
              },
            );
          } else if (entity instanceof Sprite) {
            this.world.copy(
              entity.texture,
              {
                x: Math.round(entity.frame.x),
                y: Math.round(entity.frame.y),
                width: Math.round(entity.frame.width),
                height: Math.round(entity.frame.height),
              },
              {
                x: Math.round(entity.x),
                y: Math.round(entity.y),
                width: Math.round(entity.frame.width),
                height: Math.round(entity.frame.height),
              },
            );
          } else if (entity instanceof Text) {
            entity.render(this.world);
            this.world.copy(
              entity.texture,
              {
                x: 0,
                y: 0,
                width: entity.width,
                height: entity.height,
              },
              {
                x: entity.x,
                y: entity.y,
                width: entity.width,
                height: entity.height,
              },
            );
          } else if (entity instanceof AtlasSprite) {
            this.world.copy(
              entity.texture,
              {
                x: Math.round(entity.frame.x),
                y: Math.round(entity.frame.y),
                width: Math.round(entity.frame.width),
                height: Math.round(entity.frame.height),
              },
              {
                x: Math.round(entity.x),
                y: Math.round(entity.y),
                width: Math.round(entity.frame.width),
                height: Math.round(entity.frame.height),
              },
            );
          } else if (entity instanceof Animation) {
            this.render(
              new AtlasSprite(
                this.world.currentScene,
                entity.x,
                entity.y,
                entity.atlas,
                entity.frames[entity.currentFrame],
              ),
            );
            entity.currentFrame = (entity.currentFrame + 1) % entity.frames.length;
          } else if (entity instanceof TextureSprite) {
            for (let y = 0; y < entity.data.length; y++) {
              const row = entity.data[y];
              for (let x = 0; x < row.length; x++) {
                const d: string = row[x];
                if (d !== "." && d !== " ") {
                  const pixelColor = hexToRGBA(
                    entity.palette[parseInt("0x" + d.toUpperCase())],
                  );
                  this.world.setDrawColor(
                    pixelColor[0],
                    pixelColor[1],
                    pixelColor[2],
                    pixelColor[3],
                  );
                  this.world.fillRect(
                    (x * entity.pixelWidth) + entity.x,
                    (y * entity.pixelHeight) + entity.y,
                    entity.pixelWidth,
                    entity.pixelHeight,
                  );
                }
              }
            }
          } else if (entity instanceof Group) {
            for (const child of entity.children) {
              this.render(child);
            }
          } else if (entity instanceof Button) {
            this.render(entity.child);
          } else if (entity instanceof Audio) {
            if (!entity.playing) {
              this.world.playMusic(entity.src);
              entity.playing = true;
            }
          }
    }
}