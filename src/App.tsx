import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Dices, RotateCcw, Trophy, AlertTriangle, HelpCircle, Gift, Shield, ChevronRight, Sparkles, Coins, CreditCard, History, User, BookOpen, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { generateBoard, BOARD_SIZE, TUQAY_HEROES, BACKUP_QUESTIONS } from './constants';
import { Cell, GameState } from './types';

const board = generateBoard();

const TatarOrnament = ({ className, variant = 1 }: { className?: string, variant?: number }) => {
  if (variant === 2) {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M50 5 L 95 50 L 50 95 L 5 50 Z" />
        <circle cx="50" cy="50" r="20" />
        <path d="M50 20 L 50 80 M 20 50 L 80 50" />
        <path d="M35 35 L 65 65 M 65 35 L 35 65" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <path d="M50 10 C 60 30, 90 40, 50 90 C 10 40, 40 30, 50 10 Z" />
      <circle cx="50" cy="45" r="5" fill="white" />
      <path d="M20 50 Q 35 35, 50 50 T 80 50" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M50 10 L 50 0 M 100 50 L 90 50 M 50 100 L 50 90 M 0 50 L 10 50" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

const Confetti = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            top: '120%', 
            left: `${Math.random() * 100}%`,
            rotate: 360 * 5,
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 5
          }}
          className={`absolute w-3 h-3 ${['bg-yellow-400', 'bg-red-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]}`}
          style={{ borderRadius: Math.random() > 0.5 ? '50%' : '0%' }}
        />
      ))}
    </div>
  );
};

const Dice = ({ value, rolling }: { value: number; rolling: boolean }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (rolling) {
      controls.start({
        rotate: [0, 90, 180, 270, 360],
        transition: { duration: 0.4, ease: "linear", repeat: 2 }
      });
    } else {
      controls.stop();
      controls.set({ rotate: 0 });
    }
  }, [rolling, controls]);

  const dots = [
    [],
    [4], // 1
    [0, 8], // 2
    [0, 4, 8], // 3
    [0, 2, 6, 8], // 4
    [0, 2, 4, 6, 8], // 5
    [0, 2, 3, 5, 6, 8], // 6
  ];

  return (
    <motion.div 
      animate={controls}
      className="w-24 h-24 bg-white border-4 border-emerald-800 rounded-2xl shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] flex items-center justify-center p-4 relative group"
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {dots[value].includes(i) && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 bg-emerald-900 rounded-full shadow-sm" 
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [state, setState] = useState<GameState>({
    playerPosition: 0,
    isGameOver: false,
    history: ['Уен башланды!'],
    currentEvent: null,
    isRolling: false,
    diceValue: 1,
    goldenCards: 0,
    currency: 0,
    isAnswering: false,
    isSecondQuestion: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [backupQuestion, setBackupQuestion] = useState<any>(null);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const addToHistory = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const icons = {
      info: <BookOpen className="w-4 h-4" />,
      success: <Trophy className="w-4 h-4" />,
      warning: <AlertTriangle className="w-4 h-4" />,
      error: <XCircle className="w-4 h-4" />,
    };

    setState(prev => ({
      ...prev,
      history: [{ 
        text: msg, 
        type, 
        icon: icons[type], 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        id: Math.random().toString(36).substr(2, 9)
      } as any, ...prev.history].slice(0, 4)
    }));
  };

  const handleCellAction = useCallback((cell: Cell) => {
    let newPos = state.playerPosition;
    let message = `Сез ${cell.id} клеткага эләктегез: ${cell.title}`;
    let type: 'info' | 'success' | 'warning' | 'error' = 'info';

    if (cell.type === 'hero') {
      const heroData = TUQAY_HEROES.find(h => h.title === cell.title);
      if (heroData) {
        newPos = Math.max(0, state.playerPosition + heroData.move);
        message = `${cell.title}: ${heroData.description}`;
        type = 'error';
        
        if (cell.title === 'Шүрәле') {
          setState(prev => ({ ...prev, goldenCards: Math.max(0, prev.goldenCards - 1) }));
        }
      }
    }

    if (newPos === BOARD_SIZE - 1) {
      setState(prev => ({ 
        ...prev, 
        playerPosition: newPos, 
        isGameOver: true,
        goldenCards: prev.goldenCards + 1,
        currency: prev.currency + 500
      }));
      addToHistory("Котлыйбыз! Сез финишка җиттегез һәм Алтын карта алдыгыз!", 'success');
    } else {
      setState(prev => ({ ...prev, playerPosition: newPos }));
      if (newPos !== state.playerPosition) {
        addToHistory(`Клетка эффекты: ${newPos}-нче клеткага күчү`, type);
      }
    }
    addToHistory(message, type);
  }, [state.playerPosition]);

  const handleAnswer = (index: number) => {
    if (isAnswerChecked) return;
    
    const currentQ = state.isSecondQuestion ? backupQuestion : state.currentEvent;
    const isCorrect = index === currentQ.correctAnswer;
    
    setSelectedAnswerIdx(index);
    setIsAnswerChecked(true);

    setTimeout(() => {
      if (isCorrect) {
        addToHistory("Дөрес җавап! Алга барыгыз.", 'success');
        setState(prev => ({ ...prev, isAnswering: false, isSecondQuestion: false }));
        setShowModal(false);
      } else {
        if (!state.isSecondQuestion) {
          addToHistory("Хата! Өстәмә сорауга җавап бирегез.", 'warning');
          const randomBackup = BACKUP_QUESTIONS[Math.floor(Math.random() * BACKUP_QUESTIONS.length)];
          setBackupQuestion({
            ...randomBackup,
            correctAnswer: randomBackup.correct,
            options: randomBackup.a,
            description: randomBackup.q
          });
          setState(prev => ({ ...prev, isSecondQuestion: true }));
        } else {
          addToHistory(`Яңадан хата! ${state.diceValue} клеткага артка.`, 'error');
          setState(prev => ({ 
            ...prev, 
            isAnswering: false, 
            isSecondQuestion: false,
            playerPosition: Math.max(0, prev.playerPosition - prev.diceValue)
          }));
          setShowModal(false);
        }
      }
      setSelectedAnswerIdx(null);
      setIsAnswerChecked(false);
    }, 1500);
  };

  const rollDice = () => {
    if (state.isRolling || state.isGameOver) return;

    setState(prev => ({ ...prev, isRolling: true }));

    // Simulate dice roll
    const rollInterval = setInterval(() => {
      setState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }));
    }, 80);

    setTimeout(() => {
      clearInterval(rollInterval);
      const roll = Math.floor(Math.random() * 6) + 1;
      const nextPos = Math.min(BOARD_SIZE - 1, state.playerPosition + roll);
      const currentCell = board[nextPos];

      setState(prev => ({
        ...prev,
        isRolling: false,
        diceValue: roll,
        playerPosition: nextPos,
        currentEvent: currentCell
      }));

      addToHistory(`Шакмакта: ${roll}. ${nextPos}-нче клеткага күчү.`, 'info');
      setShowModal(true);
    }, 1200);
  };

  const resetGame = () => {
    setState({
      playerPosition: 0,
      isGameOver: false,
      history: [{ text: 'Уен яңадан башланды!', type: 'info', icon: <RotateCcw className="w-3 h-3" />, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } as any],
      currentEvent: null,
      isRolling: false,
      diceValue: 1,
      goldenCards: 0,
      currency: 0,
      isAnswering: false,
      isSecondQuestion: false,
    });
    setShowModal(false);
  };

  const closeModal = () => {
    if (state.currentEvent) {
      if (state.currentEvent.type === 'question') {
        setState(prev => ({ ...prev, isAnswering: true }));
        return;
      }
      handleCellAction(state.currentEvent);
    }
    setShowModal(false);
  };

  const getCellIcon = (type: Cell['type']) => {
    switch (type) {
      case 'question': return <HelpCircle className="w-5 h-5 text-blue-500" />;
      case 'hero': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'bonus': return <Gift className="w-5 h-5 text-green-500" />;
      case 'safe': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'start': return <ChevronRight className="w-5 h-5 text-emerald-600" />;
      case 'finish': return <Trophy className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  const getGridPos = (idx: number) => {
    if (idx <= 10) return { row: 1, col: idx + 1 };
    if (idx <= 20) return { row: idx - 10 + 1, col: 11 };
    if (idx <= 30) return { row: 11, col: 11 - (idx - 20) };
    return { row: 11 - (idx - 30), col: 1 };
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-950 font-sans p-4 md:p-8 flex flex-col items-center tatar-pattern selection:bg-emerald-800 selection:text-white">
      <AnimatePresence>
        {state.isRolling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-6xl font-black text-emerald-800 uppercase tracking-tighter italic drop-shadow-2xl"
            >
              ТЫРС-ТЫРС!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="max-w-5xl w-full mb-8 flex justify-between items-end border-b-4 border-emerald-700 pb-4 relative">
        <TatarOrnament className="absolute -top-4 -left-4 w-12 h-12 text-emerald-800 opacity-20" />
        <TatarOrnament className="absolute -top-4 -right-4 w-12 h-12 text-emerald-800 opacity-20" />
        
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-emerald-800 drop-shadow-sm">Tuqay Quest</h1>
          <p className="text-sm font-mono font-bold text-red-600 mt-1">ТУКАЙ ДӨНЬЯСЫ БУЙЛАП • 40 КЛЕТОК</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-emerald-800 font-black">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span>{state.currency}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs opacity-60">
              <CreditCard className="w-4 h-4 text-yellow-600" />
              <span>{state.goldenCards} Карта</span>
            </div>
          </div>
          <button 
            onClick={resetGame}
            className="p-3 hover:bg-emerald-800 hover:text-white transition-all border-4 border-emerald-800 rounded-none flex items-center gap-2 font-black uppercase text-xs bg-white shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none"
          >
            <RotateCcw className="w-4 h-4" /> Яңадан
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Board Section */}
        <div className="xl:col-span-3 bg-white border-4 border-emerald-800 p-4 sm:p-8 shadow-[16px_16px_0px_0px_rgba(6,78,59,1)] overflow-auto relative">
          <TatarOrnament className="absolute top-2 left-2 w-8 h-8 text-emerald-100" />
          <TatarOrnament className="absolute top-2 right-2 w-8 h-8 text-emerald-100" />
          <TatarOrnament className="absolute bottom-2 left-2 w-8 h-8 text-emerald-100" />
          <TatarOrnament className="absolute bottom-2 right-2 w-8 h-8 text-emerald-100" />

          <div 
            className="grid grid-cols-11 grid-rows-11 gap-1 min-w-[600px] aspect-square"
            style={{ gridTemplateColumns: 'repeat(11, 1fr)', gridTemplateRows: 'repeat(11, 1fr)' }}
          >
            {board.map((cell, idx) => {
              const pos = getGridPos(idx);
              return (
                <div 
                  key={cell.id}
                  style={{ gridRow: pos.row, gridColumn: pos.col }}
                  className={`border-4 flex flex-col items-center justify-center relative transition-all duration-500 group cursor-help ${
                    state.playerPosition === idx 
                      ? 'bg-emerald-900 border-emerald-950 z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]' 
                      : 'bg-white border-emerald-100 hover:border-emerald-800 hover:z-10 hover:shadow-xl'
                  }`}
                >
                  <div className={`text-[8px] font-mono absolute top-0.5 left-0.5 font-bold z-20 ${state.playerPosition === idx ? 'text-emerald-200' : 'text-emerald-400'}`}>
                    {idx.toString().padStart(2, '0')}
                  </div>
                  
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <TatarOrnament className="w-full h-full" variant={idx % 2 === 0 ? 1 : 2} />
                  </div>

                  {state.playerPosition === idx ? (
                    <motion.div 
                      layoutId="player"
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full border-4 border-white shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center z-30 relative"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute -inset-2 bg-red-500/40 rounded-full animate-ping opacity-75" />
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-900 text-white text-[8px] px-2 py-1 rounded-full font-black uppercase whitespace-nowrap shadow-lg border border-emerald-700">
                        Сез монда
                      </div>
                    </motion.div>
                  ) : cell.type === 'hero' ? (
                    <div className="w-full h-full overflow-hidden relative">
                      <img 
                        src={cell.heroImage} 
                        alt={cell.title} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110" 
                        referrerPolicy="no-referrer" 
                      />
                      <div className="absolute inset-0 bg-red-900/20 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                  ) : (
                    <div className="opacity-80 scale-90 sm:scale-110 transition-transform group-hover:scale-125 z-10">
                      {getCellIcon(cell.type)}
                    </div>
                  )}

                  {/* Directional Indicator */}
                  {idx < BOARD_SIZE - 1 && (
                    <div className={`absolute z-0 opacity-20 pointer-events-none ${
                      idx < 10 ? 'right-[-8px] top-1/2 -translate-y-1/2' :
                      idx < 20 ? 'bottom-[-8px] left-1/2 -translate-x-1/2 rotate-90' :
                      idx < 30 ? 'left-[-8px] top-1/2 -translate-y-1/2 rotate-180' :
                      'top-[-8px] left-1/2 -translate-x-1/2 -rotate-90'
                    }`}>
                      <ArrowRight className="w-4 h-4 text-emerald-900" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Center Content */}
            <div className="col-start-2 col-end-11 row-start-2 row-end-11 flex flex-col items-center justify-center p-8 text-center bg-emerald-50/20 relative overflow-hidden border-4 border-dashed border-emerald-100 m-4 group">
              <h2 className="text-6xl font-black uppercase tracking-tighter text-emerald-900 opacity-20 group-hover:opacity-30 transition-opacity">Тукай Юлы</h2>
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-8 border-l-8 border-emerald-900" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t-8 border-r-8 border-emerald-900" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-8 border-l-8 border-emerald-900" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-8 border-r-8 border-emerald-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls & History */}
        <div className="flex flex-col gap-6">
          {/* Dice Control */}
          <div className="bg-white border-4 border-emerald-800 p-8 shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute -top-4 -left-4 opacity-10 rotate-45">
              <TatarOrnament className="w-16 h-16 text-emerald-900" />
            </div>
            
            <div className="text-center">
              <span className="text-sm font-black uppercase tracking-widest text-emerald-800">Шакмак ташлау</span>
            </div>
            
            <Dice value={state.diceValue} rolling={state.isRolling} />

            <button 
              onClick={rollDice}
              disabled={state.isRolling || state.isGameOver}
              className={`group relative w-full py-5 font-black uppercase tracking-widest border-4 border-emerald-900 transition-all text-lg overflow-hidden ${
                state.isRolling || state.isGameOver 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-500 active:translate-y-1 active:shadow-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {!state.isRolling && !state.isGameOver && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              )}
              <span className="relative z-10">{state.isGameOver ? 'Уен тәмам' : 'Алга!'}</span>
            </button>
          </div>

          {/* History */}
          <div className="bg-white border-4 border-emerald-800 p-6 shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] flex-1 relative flex flex-col h-[500px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 opacity-70 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4" /> Уен тарихы
              </div>
              <span className="text-[10px] font-mono opacity-50">Соңгы вакыйгалар</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 scroll-smooth">
              <AnimatePresence initial={false}>
                {state.history.map((entry: any, i) => (
                  <motion.div 
                    initial={{ x: 50, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={entry.id || i} 
                    className={`group relative flex items-start gap-3 p-4 border-l-4 transition-all hover:bg-emerald-50/50 ${
                      i === 0 
                        ? 'border-emerald-800 bg-white shadow-md ring-1 ring-emerald-800/10' 
                        : 'border-emerald-200 bg-white/50 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`mt-0.5 p-2 rounded-full shadow-sm border ${
                      entry.type === 'success' ? 'bg-green-100 border-green-200 text-green-700' :
                      entry.type === 'error' ? 'bg-red-100 border-red-200 text-red-700' :
                      entry.type === 'warning' ? 'bg-yellow-100 border-yellow-200 text-yellow-700' :
                      'bg-emerald-100 border-emerald-200 text-emerald-700'
                    }`}>
                      {entry.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                          entry.type === 'success' ? 'bg-green-100 text-green-800' :
                          entry.type === 'error' ? 'bg-red-100 text-red-800' :
                          entry.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {entry.type === 'info' ? 'ХӘБӘР' : entry.type === 'success' ? 'УҢЫШ' : entry.type === 'warning' ? 'КИСӘТҮ' : 'ХАТА'}
                        </span>
                        <span className="text-[9px] font-mono opacity-40 font-bold">{entry.time}</span>
                      </div>
                      <p className="text-sm font-medium leading-snug text-emerald-950 break-words">{entry.text}</p>
                    </div>
                    {i === 0 && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute -left-1 top-0 bottom-0 w-1 bg-emerald-800"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-6 border-t-4 border-emerald-50">
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-3 text-emerald-900 flex items-center gap-2">
                <HelpCircle className="w-3 h-3" /> Ничек уйнарга?
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 border-2 border-blue-100 rounded-none">
                  <HelpCircle className="w-3 h-3 text-blue-500" />
                  <span className="text-[9px] font-black uppercase text-blue-800">Сораулар</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-50 border-2 border-red-100 rounded-none">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span className="text-[9px] font-black uppercase text-red-800">Җазалар</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 border-2 border-green-100 rounded-none">
                  <Gift className="w-3 h-3 text-green-500" />
                  <span className="text-[9px] font-black uppercase text-green-800">Бонуслар</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-emerald-50 border-2 border-emerald-100 rounded-none">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase text-emerald-800">Тынычлык</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <AnimatePresence>
        {showModal && state.currentEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-white border-8 border-emerald-800 p-8 md:p-12 max-w-2xl w-full shadow-[32px_32px_0px_0px_rgba(6,78,59,1)] relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-50 rounded-full opacity-50 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-50 rounded-full opacity-30 blur-3xl" />
              
              <TatarOrnament className="absolute -top-10 -right-10 w-48 h-48 text-emerald-50 opacity-40 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 relative z-10">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-emerald-800 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <div className="relative p-1 bg-white border-4 border-emerald-800 rounded-2xl overflow-hidden w-32 h-32 md:w-40 md:h-40 flex items-center justify-center shadow-xl">
                    {state.currentEvent.type === 'hero' ? (
                      <img src={state.currentEvent.heroImage} alt={state.currentEvent.title} className="w-full h-full object-cover hover:scale-110 transition-all duration-500" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="scale-150">{getCellIcon(state.currentEvent.type)}</div>
                    )}
                  </div>
                  {state.currentEvent.type === 'hero' && (
                    <div className="absolute -bottom-3 -right-3 bg-red-600 text-white p-2 border-2 border-white shadow-lg">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="text-center md:text-left flex-1">
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em] mb-3 border-2 border-emerald-200">
                    {state.isAnswering ? "Викторина сынавы" : "Клетка вакыйгасы"}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-emerald-900 leading-none mb-4">
                    {state.isAnswering ? (state.isSecondQuestion ? "Өстәмә сорау!" : "Белем сынавы") : state.currentEvent.title}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-emerald-600/60 font-mono text-xs font-bold">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {state.isAnswering ? "Тукай" : "Герой"}</span>
                    <span className="w-1 h-1 bg-emerald-200 rounded-full" />
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {state.currentEvent.type}</span>
                  </div>
                </div>
              </div>

              <div className="mb-10 p-8 bg-emerald-50 border-4 border-emerald-800/10 relative z-10 group overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-800/30" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-800/30" />
                <TatarOrnament className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-emerald-800/5 pointer-events-none" />
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl leading-relaxed text-emerald-950 font-black text-center md:text-left relative z-10"
                >
                  {state.isSecondQuestion ? backupQuestion?.description : state.currentEvent.description}
                </motion.p>
              </div>

              {state.isAnswering ? (
                <div className="grid grid-cols-1 gap-4 relative z-10">
                  {(state.isSecondQuestion ? backupQuestion?.options : state.currentEvent.options)?.map((opt: string, idx: number) => {
                    const currentQ = state.isSecondQuestion ? backupQuestion : state.currentEvent;
                    const isCorrect = idx === currentQ.correctAnswer;
                    const isSelected = idx === selectedAnswerIdx;
                    
                    let bgColor = 'bg-white';
                    let borderColor = 'border-emerald-800';
                    let textColor = 'text-emerald-900';
                    
                    if (isAnswerChecked) {
                      if (isCorrect) {
                        bgColor = 'bg-green-500';
                        borderColor = 'border-green-700';
                        textColor = 'text-white';
                      } else if (isSelected) {
                        bgColor = 'bg-red-500';
                        borderColor = 'border-red-700';
                        textColor = 'text-white';
                      }
                    }

                    return (
                      <motion.button 
                        whileHover={!isAnswerChecked ? { x: 10, scale: 1.02 } : {}}
                        whileTap={!isAnswerChecked ? { scale: 0.98 } : {}}
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswerChecked}
                        className={`w-full py-5 px-8 border-4 ${borderColor} ${bgColor} ${textColor} font-black uppercase tracking-widest transition-all text-lg text-left flex items-center justify-between group/btn shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] ${!isAnswerChecked ? 'hover:shadow-none hover:bg-emerald-800 hover:text-white' : ''}`}
                      >
                        <div className="flex items-center gap-6">
                          <span className={`w-10 h-10 ${isAnswerChecked ? 'bg-white/20' : 'bg-emerald-100 group-hover/btn:bg-emerald-700'} flex items-center justify-center rounded-full border-2 border-current text-sm transition-colors font-mono`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {opt}
                        </div>
                        <div className="flex items-center gap-2">
                          {isAnswerChecked && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                          {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                          {!isAnswerChecked && (
                            <div className="bg-emerald-100 group-hover/btn:bg-emerald-700 p-2 rounded-full transition-colors">
                              <ArrowRight className="w-5 h-5 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-4 group-hover/btn:translate-x-0" />
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: '#059669' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="w-full py-6 bg-emerald-800 text-white font-black uppercase tracking-widest transition-all text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none relative z-10"
                >
                  Ярар, алга!
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Victory Overlay */}
      <AnimatePresence>
        {state.isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-emerald-900/95 backdrop-blur-md p-8 text-center text-white overflow-hidden"
          >
            <Confetti />
            
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Trophy className="w-48 h-48 mb-8 text-yellow-400 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
              </motion.div>
              
              <h1 className="text-8xl font-black uppercase tracking-tighter mb-6 drop-shadow-lg">Җиңү!</h1>
              
              <div className="relative mb-12 group">
                <div className="absolute -inset-4 bg-yellow-400 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  className="w-64 h-40 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-xl border-4 border-yellow-100 shadow-2xl flex flex-col items-center justify-center p-4 text-emerald-900 relative preserve-3d"
                >
                  <div className="absolute top-2 left-2 opacity-20">
                    <TatarOrnament className="w-8 h-8" />
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-20">
                    <TatarOrnament className="w-8 h-8" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-inner">
                      <img src="https://picsum.photos/seed/tuqay_portrait/100/100" alt="Tuqay" className="w-full h-full object-cover grayscale brightness-110" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left">
                      <span className="font-black uppercase tracking-tighter text-xs block opacity-60">Валюта Картасы</span>
                      <span className="font-black uppercase tracking-tighter text-lg leading-none">Габдулла Тукай</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-emerald-900/10 my-2" />
                  
                  <div className="flex items-center justify-between w-full px-2">
                    <div className="flex items-center gap-1 font-black text-2xl">
                      <Coins className="w-6 h-6 text-yellow-700" />
                      <span>500</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold opacity-40">
                      ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-6 -right-6 bg-red-600 text-white text-sm font-black px-4 py-2 uppercase tracking-widest rotate-12 shadow-xl border-2 border-white"
                >
                  Җиңүче Картасы
                </motion.div>
              </div>

              <p className="text-2xl font-bold mb-12 max-w-2xl leading-relaxed text-emerald-50">
                Сез Тукай дөньясын яхшы беләсез! Сезгә Алтын Карта һәм 500 валюта бирелә.
              </p>

              <button 
                onClick={resetGame}
                className="group relative px-20 py-8 bg-white text-emerald-900 font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-[16px_16px_0px_0px_rgba(0,0,0,0.3)] text-3xl active:translate-y-2 active:shadow-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors">Яңадан башлау</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
