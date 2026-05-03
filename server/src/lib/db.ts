import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data.json');

export enum ItemType {
  WEAPON = 'Weapon',
  ARMOR = 'Armor',
  MEDS = 'Meds',
  FOOD = 'Food',
  TOOL = 'Tool',
  AMMO = 'Ammo'
}

interface Database {
  users: any[];
  articles: any[];
  categories: any[];
  races: any[];
  classes: any[];
  perks: any[];
  items: any[];
}

const initialData: Database = {
  users: [{ id: 1, username: 'admin', password: 'admin', role: 'admin' }],
  articles: [
    { id: 1, title: 'История Пустоши', content: 'После падения бомб...', categoryId: 1 }
  ],
  categories: [{ id: 1, name: 'Лор' }],
  races: [
    { id: 1, name: 'Гуль', description: 'Облученные люди', bonus: '+2 Телосложение' },
    { id: 2, name: 'Человек', description: 'Обычные жители', bonus: '+1 ко всем характеристикам' }
  ],
  classes: [
    { 
      id: 1, 
      name: 'Солдат Братства', 
      description: 'Тяжелая броня и оружие. Основная сила Братства Стали в Пустоши.', 
      image: 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg', // Mock image
      fullImage: 'https://images.v-s.mobi/vi/Qta9chteIug/maxresdefault.jpg', // Mock full image for description
      levels: [
        { level: 1, perk: 'Ношение силовой брони', bonus: '+1 СИЛ' },
        { level: 2, perk: 'Владение тяжелым оружием', bonus: '+2 Урон' },
        { level: 3, perk: 'Тактическая подготовка', bonus: 'Доп. атака' }
      ]
    }
  ],
  perks: [
    { id: 1, name: 'Кровавая баня', description: 'Больше урона', requirement: 'Уровень 5' }
  ],
  items: [
    { id: 1, name: '10мм Пистолет', type: ItemType.WEAPON, description: 'Классика', price: 100, stats: '{}' }
  ]
};

export function readDb(): Database {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

export function writeDb(data: Database) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
