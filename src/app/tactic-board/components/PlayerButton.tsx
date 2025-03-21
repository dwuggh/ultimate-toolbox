import { useCallback, useState } from "react";
import { PlayerColor, PlayerData } from "./Player";
import { Point } from "pixi.js";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";

interface Props {
  addPlayer: (newPlayer: PlayerData) => void
}

export default function PlayerButton({addPlayer}: Props) {
  const [color, setColor] = useState<PlayerColor>(PlayerColor.RED);

  const onClick = useCallback(() => {
    const newPlayer = new PlayerData(color, 0, new Point(20, 20));
    addPlayer(newPlayer);
  }, [color]);

  return (
    <div className="flex gap-2">
      <Select 
        value={color as any}
        onValueChange={(val) => setColor(val as unknown as PlayerColor)}
      >
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a color" />
        </SelectTrigger>
        <SelectContent>
        <SelectGroup>
        {Object.entries(PlayerColor)
          .filter(([key]) => isNaN(Number(key)))
          .map(([key, value]) => (
            <SelectItem key={key} value={value as string}>
              {key.toLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={onClick} variant='ghost'>
        <LuPlus
        className="h-5 text-blue-500 hover:text-blue-700 transition-colors" />
      </Button>
    </div>
  );
}
