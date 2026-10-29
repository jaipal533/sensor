import React from 'react';
import { Plus } from 'lucide-react';

interface RoomSelectorProps {
  currentRoom: string;
  onSelectRoom: (room: string) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  currentRoom,
  onSelectRoom,
}) => {
  const rooms = [
    'Living room',
    'Bedroom',
    'Dining room',
    'Kitchen',
    'Entrance',
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-none">
      {rooms.map((room) => {
        const isActive = currentRoom.toLowerCase() === room.toLowerCase();
        return (
          <button
            key={room}
            onClick={() => onSelectRoom(room)}
            className={`px-5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
              isActive
                ? 'bg-[#38bdf8] text-slate-950 font-bold shadow-md shadow-sky-500/20'
                : 'bg-[#1a2533] text-slate-400 hover:text-slate-200 hover:bg-[#223143] border border-[#233346]'
            }`}
          >
            {room}
          </button>
        );
      })}

      <button
        onClick={() => alert('New room creation: connect an ESP32 node with distinct node_id')}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#1a2533]/60 hover:bg-[#223143] border border-dashed border-[#2b3c50] transition whitespace-nowrap"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add house place</span>
      </button>
    </div>
  );
};
