import { useEffect, useState } from 'react';

type GuildType = {
  name: string;
  thumbnail: string;
  totalMembers: number;
};

const fakeList = [
  {
    name: 'Dragon Fire and Ice Gro@p',
    totalMembers: 152,
    thumbnail:
      'https://i.pinimg.com/564x/91/4e/db/914edb1497cd7f9136ca7108372ce186.jpg',
  },
  {
    name: "Knight's Watch1",
    totalMembers: 98,
    thumbnail:
      'https://i.pinimg.com/564x/06/0d/21/060d2195df7a10d4fd8e37fde4cf5320.jpg',
  },
  {
    name: 'Mystic Warriors',
    totalMembers: 120,
    thumbnail:
      'https://i.pinimg.com/564x/a8/4b/c9/a84bc99c51fb25f3d246046d69603a64.jpg',
  },
  {
    name: 'Shadow Hunters1',
    totalMembers: 75,
    thumbnail:
      'https://i.pinimg.com/564x/e7/b5/40/e7b54060958224d9043901141c7c2bca.jpg',
  },
  {
    name: 'Arcane Masters1',
    totalMembers: 89,
    thumbnail:
      'https://i.pinimg.com/564x/46/57/aa/4657aa73874d6f331e77d486d143cea4.jpg',
  },
  {
    name: 'Dragon Slayers1',
    totalMembers: 152,
    thumbnail:
      'https://i.pinimg.com/564x/91/4e/db/914edb1497cd7f9136ca7108372ce186.jpg',
  },
  {
    name: "Knight's Watch",
    totalMembers: 98,
    thumbnail:
      'https://i.pinimg.com/564x/06/0d/21/060d2195df7a10d4fd8e37fde4cf5320.jpg',
  },
  {
    name: 'Mystic War',
    totalMembers: 120,
    thumbnail:
      'https://i.pinimg.com/564x/a8/4b/c9/a84bc99c51fb25f3d246046d69603a64.jpg',
  },
  {
    name: 'Shadow Hunters',
    totalMembers: 75,
    thumbnail:
      'https://i.pinimg.com/564x/e7/b5/40/e7b54060958224d9043901141c7c2bca.jpg',
  },
  {
    name: 'Arcane Masters2',
    totalMembers: 89,
    thumbnail:
      'https://i.pinimg.com/564x/46/57/aa/4657aa73874d6f331e77d486d143cea4.jpg',
  },
  {
    name: 'Dragon Slayers2',
    totalMembers: 152,
    thumbnail:
      'https://i.pinimg.com/564x/91/4e/db/914edb1497cd7f9136ca7108372ce186.jpg',
  },
  {
    name: "Knight's Watchers",
    totalMembers: 98,
    thumbnail:
      'https://i.pinimg.com/564x/06/0d/21/060d2195df7a10d4fd8e37fde4cf5320.jpg',
  },
];

const useGetGuildsList = () => {
  const [guilds, setGuilds] = useState<GuildType[]>([]);

  useEffect(() => {
    const getGuildsList = async () => {
      setTimeout(() => {
        setGuilds(fakeList);
      }, 1000);
    };

    getGuildsList();
  }, []);

  return { guilds };
};

export { useGetGuildsList };
