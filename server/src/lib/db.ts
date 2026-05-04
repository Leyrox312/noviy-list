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
  origins: any[];
  mechanics: any[];
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
    { id: 1, name: 'Кровавая баня', description: 'Больше урона', requirement: 'Уровень 5', image: null }
  ],
  items: [
    { id: 1, name: '10мм Пистолет', type: ItemType.WEAPON, subType: 'Пистолеты', description: 'Классика', price: 100, stats: '1к8 урон' }
  ],
  origins: [
    { id: 1, name: 'Выходец из Убежища', description: 'Вы выросли в безопасности...', bonus: 'Доп. Очки навыков' }
  ],
  mechanics: [
    { 
      id: 'basics', 
      title: 'ОСНОВНЫЕ ПРАВИЛА', 
      cards: [
        { id: 'checks', title: 'Проверки характеристик', content: '<p>Базовая механика: 1к20 + модификатор S.P.E.C.I.A.L. против Класса Сложности (КС).</p>' },
        { id: 'crits', title: 'Критический успех и провал', content: '<p>20 на кубе — автоматический успех и критический урон. 1 на кубе — критическая неудача (осечка оружия, падение и т.д.).</p>' },
        { id: 'rest', title: 'Отдых', content: '<ul><li><strong>Короткий отдых:</strong> 1 час, позволяет потратить Кости Хитов для лечения.</li><li><strong>Длинный отдых:</strong> 8 часов, полное восстановление ОЗ и половины Костей Хитов.</li></ul>' }
      ]
    },
    { 
      id: 'combat', 
      title: 'ПРАВИЛА БОЯ', 
      cards: [
        { id: 'initiative', title: 'Инициатива и Порядок', content: '<p>Бой в Fallout DND основан на пошаговой системе. В начале боя каждый участник делает бросок Инициативы (1к20 + модификатор Ловкости).</p>' },
        { id: 'actions', title: 'Действия в бою', content: '<ul><li><strong>Действие:</strong> Атака, использование предмета, применение способности.</li><li><strong>Бонусное действие:</strong> Быстрое использование химии, перезарядка некоторых видов оружия.</li><li><strong>Реакция:</strong> Атака при возможности, защита.</li><li><strong>Движение:</strong> Перемещение на расстояние, равное вашей скорости.</li></ul>' },
        { id: 'vats', title: 'Система VATS', content: '<p>Особая механика, позволяющая тратить Очки Действия (ОД) для прицельных выстрелов по конечностям противника, что дает различные дебаффы врагу.</p>' }
      ]
    },
    { 
      id: 'radiation', 
      title: 'РАДИАЦИЯ', 
      cards: [
        { id: 'rad-levels', title: 'Уровни облучения', content: '<p>Радиация в Пустоши вездесуща. Она измеряется в Радах. Накопление радиации снижает ваш максимальный запас здоровья (ОЗ).</p>' },
        { id: 'rad-effects', title: 'Эффекты облучения', content: '<ul><li><strong>Незначительное:</strong> Нет эффектов.</li><li><strong>Среднее:</strong> -1 к Телосложению.</li><li><strong>Сильное:</strong> Помеха на проверки характеристик.</li><li><strong>Смертельное:</strong> Прямая угроза жизни, галлюцинации.</li></ul>' },
        { id: 'rad-cure', title: 'Лечение', content: '<p>Используйте Антирадин для вывода радиации или посетите врача в крупном поселении.</p>' }
      ]
    },
    { 
      id: 'addiction', 
      title: 'ЗАВИСИМОСТЬ', 
      cards: [
        { id: 'addiction-risk', title: 'Риск зависимости', content: '<p>При использовании сильнодействующей химии (Винт, Психо, Баффаут) персонаж должен совершить спасбросок Телосложения.</p>' },
        { id: 'withdrawal', title: 'Эффекты ломки', content: '<p>Если персонаж зависим и не принимает препарат в течение длительного времени, он получает штрафы к характеристикам в зависимости от типа вещества.</p>' },
        { id: 'addiction-cure', title: 'Излечение', content: '<p>Зависимость можно вылечить с помощью Аддиктола или специальной детокс-процедуры у доктора.</p>' }
      ]
    }
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
