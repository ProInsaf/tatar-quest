import { Cell } from './types';

export const BOARD_SIZE = 40;

export const TUQAY_HEROES = [
  { title: "Бүреләр", description: "Бүреләрдән качканда адаштыгыз! Бер адым артка.", move: -1, image: "https://i.ibb.co/pvZ8Zm3j/photo-2026-04-01-09-14-41-jpg-202604010917.jpg" },
  { title: "Су анасы", description: "Су анасын тараксыз калдырмакчы идегеземе? 2 адым артка.", move: -2, image: "https://i.ibb.co/0ygkTtqJ/imresizer-ph-02.jpg" },
  { title: "Шүрәле", description: "Шүрәле белән кети-кети уйныйсыз! 3 адым артка.", move: -3, image: "https://i.ibb.co/qYyg9QbW/photo-2026-04-01-09-14-41-jpg-202604010920.jpg" },
  { title: "Акбай", description: "Акбай сезне куа башлады! 2 клеткага артка.", move: -2, image: "https://i.ibb.co/93qbNMYJ/photo-2026-04-01-09-14-41-jpg-202604011204.jpg" },
  { title: "Дию", description: "Дию пэрие сезне су төбенә төшерде! 4 клеткага артка.", move: -4, image: "https://i.ibb.co/svb0Z57P/photo-2026-04-01-09-14-41-jpg-202604011206.jpg" },
  { title: "Кисекбаш", description: "Куркыныч Кисекбаш! 5 клеткага артка.", move: -5, image: "https://i.ibb.co/cPt477K/photo-2026-04-01-09-14-41-jpg-202604010924.jpg" },
  { title: "Күбәләк", description: "Күбәләк артыннан йөгереп киттегез! 1 клеткага артка.", move: -1, image: "https://i.ibb.co/322F1Gg/photo-2026-04-01-09-14-41-jpg-202604011211.jpg" },
  { title: "Шаян песи", description: "Песи сезне тырнады! 3 клеткага артка.", move: -3, image: "https://i.ibb.co/zTY9R3cS/photo-2026-04-01-09-14-41-jpg-202604011227.jpg" },
  { title: "Өй иясе", description: "Өй иясе сезне куркытты! 2 клеткага артка.", move: -2, image: "https://i.ibb.co/Y4pDCYYx/photo-2026-04-01-09-14-41-jpg-202604011225-1.jpg" },
  { title: "Сагди абзый", description: "Кырда эшләргә калдыгыз! 3 клеткага артка.", move: -3, image: "https://i.ibb.co/bM864dHf/photo-2026-04-01-09-14-41-jpg-202604011225.jpg" },
];

export const TUQAY_QUESTIONS = [
  { q: "Тукай кайда туган?", a: ["Кушлавыч", "Казан", "Уральск"], correct: 0 },
  { q: "Тукай ничәнче елда туган?", a: ["1886", "1890", "1875"], correct: 0 },
  { q: "Тукай соңгы елларын кайда уздырган?", a: ["Казан", "Мәскәү", "Уфа"], correct: 0 },
  { q: "Татар теленең гимны булган шигыре?", a: ["Туган тел", "Бәйрәм", "Кыш"], correct: 0 },
  { q: "Кырлайдагы асрауга алган атасының исеме?", a: ["Сәгди", "Әхмәт", "Гали"], correct: 0 },
  { q: "Тукай ничә яшендә вафат булган?", a: ["27", "33", "45"], correct: 0 },
  { q: "Су анасы турындагы әкият кайда бара?", a: ["Кырлай", "Казан", "Арча"], correct: 0 },
  { q: "Тукайның беренче басылган шигыре кайда чыккан?", a: ["Уральск", "Казан", "Петербург"], correct: 0 },
  { q: "Тукайның әтисе кем булган?", a: ["Мулла", "Укытучы", "Крестьян"], correct: 0 },
  { q: "Тукайның балачак исеме?", a: ["Апуш", "Габдулла", "Тукай"], correct: 0 },
  { q: "Тукайның дусты, композитор?", a: ["Салих Сәйдәшев", "Нәҗип Җиһанов", "Заһид Хәбибуллин"], correct: 0 },
  { q: "Тукайның 'Шурале' балетына музыканы кем язган?", a: ["Фәрит Яруллин", "Рөстәм Яхин", "Әнвәр Бакиров"], correct: 0 },
  { q: "Тукайның туган көне кайчан?", a: ["26 апрель", "30 август", "15 октябрь"], correct: 0 },
  { q: "Тукайның әнисе исеме?", a: ["Мәмдүдә", "Бибисара", "Гайшә"], correct: 0 },
  { q: "Тукайның балачагы узган авыл?", a: ["Кырлай", "Кушлавыч", "Өчиле"], correct: 0 },
  { q: "Тукайның 'Пар ат' шигыре нәрсә турында?", a: ["Казанга кайту", "Урман", "Мәхәббәт"], correct: 0 },
  { q: "Габдулла Тукай Казанда «Болгар» кунакханәсендә кайсы якын дусты һәм күренекле язучы белән бер бүлмәдә яшәгән?", a: ["Фатих Әмирхан", "Галиәсгар Камал", "Мәҗит Гафури"], correct: 0 },
  { q: "Тукайның иң танылган әкиятендәге маңгаенда мөгезе булган урман җене ничек атала?", a: ["Шүрәле", "Су анасы", "Кисекбаш"], correct: 0 },
  { q: "Нәни Габдулланы Казанның Пөшмән базарында кем аша яңа гаиләгә (уллыкка) бирәләр?", a: ["Мөхәммәтвәли", "Сәгди", "Әхмәт"], correct: 0 },
  { q: "Тукай дуслары белән бергә чыгарган, эчендә бик күп кызыклы рәсемнәр һәм көлкеле шигырьләр булган журнал ничек атала?", a: ["«Ялт-Йолт»", "«Казан»", "«Мәгариф»"], correct: 0 },
];

export const BACKUP_QUESTIONS = [
  { q: "Тукайның фамилиясе нинди?", a: ["Тукаев", "Мөхәммәтҗанов", "Габдуллин"], correct: 0 },
  { q: "Тукайның 'Милли моңнар' шигыре нәрсә турында?", a: ["Халык язмышы", "Табигать", "Мәктәп"], correct: 0 },
  { q: "Тукайның 'Бала белән Күбәләк' шигырендә бала нәрсә сорый?", a: ["Ничек яшисең?", "Кая очасың?", "Нәрсә ашыйсың?"], correct: 0 },
  { q: "Тукайның 'Кәҗә белән Сарык' әкиятендә алар нәрсә таба?", a: ["Бүре башы", "Алтын", "Ашамлык"], correct: 0 },
  { q: "Тукайның 'Шурале' әкиятендә Былтыр каян килә?", a: ["Авылдан", "Шәһәрдән", "Урманнан"], correct: 0 },
];

export const generateBoard = (): Cell[] => {
  const board: Cell[] = [];
  
  // Fixed positions for heroes and questions to ensure exact counts
  const heroPositions = new Set<number>();
  while (heroPositions.size < 10) {
    const p = Math.floor(Math.random() * (BOARD_SIZE - 2)) + 1;
    heroPositions.add(p);
  }

  const questionPositions = new Set<number>();
  while (questionPositions.size < 20) {
    const p = Math.floor(Math.random() * (BOARD_SIZE - 2)) + 1;
    if (!heroPositions.has(p)) {
      questionPositions.add(p);
    }
  }

  let heroIdx = 0;
  let qIdx = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i === 0) {
      board.push({ id: i, type: 'start', title: 'Старт', description: 'Тукай дөньясына рәхим итегез!' });
      continue;
    }
    if (i === BOARD_SIZE - 1) {
      board.push({ id: i, type: 'finish', title: 'Финиш', description: 'Сез җиңүче! Алтын карта сезнеке!' });
      continue;
    }

    if (heroPositions.has(i)) {
      const hero = TUQAY_HEROES[heroIdx % TUQAY_HEROES.length];
      board.push({ 
        id: i, 
        type: 'hero', 
        title: hero.title, 
        description: hero.description,
        heroImage: hero.image || `https://picsum.photos/seed/${hero.title}_tuqay/200/200`
      });
      heroIdx++;
    } else if (questionPositions.has(i)) {
      const q = TUQAY_QUESTIONS[qIdx % TUQAY_QUESTIONS.length];
      board.push({ 
        id: i, 
        type: 'question', 
        title: `Сорау #${qIdx + 1}`, 
        description: q.q,
        options: q.a,
        correctAnswer: q.correct,
        heroImage: (q as any).image // Optional image for questions
      });
      qIdx++;
    } else {
      board.push({ 
        id: i, 
        type: 'safe', 
        title: `Клетка ${i}`, 
        description: 'Буш клетка. Бернәрсе дә эшләргә кирәкми.' 
      });
    }
  }
  
  return board;
};
