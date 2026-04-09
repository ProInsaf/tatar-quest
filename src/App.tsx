import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { RotateCcw, Trophy, AlertTriangle, HelpCircle, Gift, Shield, ChevronRight, Sparkles, CreditCard, History, User, BookOpen, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
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
      className="w-16 h-16 sm:w-full sm:max-w-[450px] sm:aspect-square bg-white border-2 sm:border-8 border-emerald-800 rounded-lg sm:rounded-[3.5rem] shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] sm:shadow-[24px_24px_0px_0px_rgba(6,78,59,1)] flex items-center justify-center p-2 sm:p-10 relative group"
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-1 sm:gap-10 w-full h-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {dots[value].includes(i) && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 sm:w-16 sm:h-16 bg-emerald-900 rounded-full shadow-sm" 
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MiniDice = ({ value }: { value: number }) => {
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
    <div className="w-8 h-8 sm:w-24 sm:h-24 bg-white border-2 border-emerald-800 rounded sm:rounded-xl flex items-center justify-center p-1 sm:p-4">
      <div className="grid grid-cols-3 grid-rows-3 gap-0.5 sm:gap-2 w-full h-full">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {dots[value].includes(i) && (
              <div className="w-1 h-1 sm:w-4 sm:h-4 bg-emerald-900 rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TATAR_ROLL_LABEL = (n: number) => {
  return `${n} шакмак алга`;
};

const WelcomeScreen = ({ onStart }: { onStart: () => void }) => {
  const [launched, setLaunched] = useState(false);

  const handleStart = () => {
    setLaunched(true);
    setTimeout(onStart, 900);
  };

  const particles = Array.from({ length: 60 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: launched ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #064e3b 0%, #022c22 60%, #000 100%)'
      }}
    >
      {/* Animated floating ornaments */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${(Math.random() - 0.5) * 200}vw`,
            y: `${(Math.random() - 0.5) * 200}vh`,
            opacity: 0,
            scale: Math.random() * 0.6 + 0.2,
          }}
          animate={{
            x: [`${(Math.random() - 0.5) * 60}vw`, `${(Math.random() - 0.5) * 60}vw`],
            y: [`${(Math.random() - 0.5) * 60}vh`, `${(Math.random() - 0.5) * 60}vh`],
            opacity: [0, Math.random() * 0.15 + 0.04, 0],
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 12 + 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
          className="absolute text-emerald-400 pointer-events-none"
          style={{ left: '50%', top: '50%' }}
        >
          <TatarOrnament className={`w-${Math.floor(Math.random() * 8 + 4)} h-${Math.floor(Math.random() * 8 + 4)}`} variant={i % 2 === 0 ? 1 : 2} />
        </motion.div>
      ))}

      {/* Glow rings */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute w-[250px] h-[250px] sm:w-[600px] sm:h-[600px] rounded-full border-2 border-emerald-400"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.04, 0.12, 0.04] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute w-[350px] h-[350px] sm:w-[800px] sm:h-[800px] rounded-full border border-yellow-400"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Tukay portrait */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 14 }}
          className="mb-4 sm:mb-6 relative"
        >
          <div className="absolute -inset-2 sm:-inset-3 bg-yellow-400/20 rounded-full blur-xl sm:blur-2xl animate-pulse" />
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 border-yellow-400 overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.5)] sm:shadow-[0_0_40px_rgba(250,204,21,0.5)] relative">
            <img
              src="https://avatars.mds.yandex.net/i?id=84c7c28b2d73e2684e67d3867411fe209c0d8277-8310551-images-thumbs&n=13"
              alt="Габдулла Тукай"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="absolute -inset-3 sm:-inset-4 rounded-full border border-dashed border-emerald-500/50"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', damping: 12 }}
        >
          <h1
            className="text-4xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-0.5 sm:mb-1"
            style={{
              background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #ffffff 60%, #6ee7b7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.4))'
            }}
          >
            ТУКАЙ
          </h1>
          <h2
            className="text-[14px] sm:text-4xl font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-emerald-300 mt-1 sm:mt-2"
          >
            МОНОПОЛИЯСЕ
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2 sm:mt-4 text-emerald-400 font-mono text-[9px] sm:text-sm uppercase tracking-widest px-4"
        >
          Тукай дөньясы буйлап сәяхәт
        </motion.p>

        {/* Start button */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: 'spring', damping: 10 }}
          className="mt-12 relative"
        >
          {/* Pulsing glow behind button */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-yellow-400 rounded-none blur-2xl"
          />

          {/* Launch burst rings */}
          <AnimatePresence>
            {launched && [0, 1, 2].map(i => (
              <motion.div
                key={i}
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3 + i * 1.5, opacity: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                className="absolute inset-0 border-4 border-yellow-400 rounded-full"
              />
            ))}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={launched}
            className="relative px-6 sm:px-20 py-3 sm:py-6 font-black uppercase tracking-[0.1em] sm:tracking-[0.25em] text-[14px] sm:text-3xl text-emerald-950 border-2 sm:border-4 border-yellow-300 overflow-hidden rounded-md sm:rounded-none"
            style={{
              background: 'linear-gradient(135deg, #fde68a, #f59e0b)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.5), 0 0 15px rgba(250,204,21,0.3)'
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', repeatDelay: 1 }}
              className="absolute inset-0 bg-white/30 skew-x-12"
            />
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-7 h-7" />
              Башларга!
            </span>
          </motion.button>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex items-center gap-4 text-emerald-600/40"
        >
          <TatarOrnament className="w-6 h-6" />
          <span className="font-mono text-xs tracking-widest uppercase">Г. Тукай • 1886 – 1913</span>
          <TatarOrnament className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showStartMessage, setShowStartMessage] = useState(false);

  const [state, setState] = useState<GameState>({
    playerPosition: 0,
    isGameOver: false,
    history: [{
      text: 'Уен башланды!',
      type: 'info' as const,
      icon: <BookOpen className="w-4 h-4" />,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      id: 'init'
    }] as any[],
    currentEvent: null,
    isRolling: false,
    diceValue: 1,
    goldenCards: 0,
    isAnswering: false,
    isSecondQuestion: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [backupQuestion, setBackupQuestion] = useState<any>(null);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showCheat, setShowCheat] = useState(false);
  const cheatKeys = useRef(new Set<string>());

  // F+J cheat combo
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      cheatKeys.current.add(e.key.toLowerCase());
      if (cheatKeys.current.has('f') && cheatKeys.current.has('j')) {
        setShowCheat(prev => !prev);
      }
    };
    const onUp = (e: KeyboardEvent) => cheatKeys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

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
    let type: 'info' | 'success' | 'warning' | 'error' = 'info';

    if (cell.type === 'hero') {
      const heroData = TUQAY_HEROES.find(h => h.title === cell.title);
      if (heroData) {
        type = 'error';

        if (cell.title === 'Шүрәле') {
          setState(prev => ({ ...prev, goldenCards: Math.max(0, prev.goldenCards - 1) }));
        }

        setState(prev => {
          const newPos = Math.max(0, prev.playerPosition + heroData.move);
          
          if (newPos === BOARD_SIZE - 1) {
            setTimeout(() => addToHistory("Котлыйбыз! Сез финишка җиттегез һәм Алтын карта алдыгыз!", 'success'), 0);
            return {
              ...prev,
              playerPosition: newPos,
              isGameOver: true,
              goldenCards: prev.goldenCards + 1
            };
          } else {
            const steps = Math.abs(heroData.move);
            const direction = heroData.move < 0 ? '\u0430\u0440\u0442\u043a\u0430' : '\u0430\u043b\u0433\u0430';
            setTimeout(() => addToHistory(`${steps} \u0448\u0430\u043a\u043c\u0430\u043a\u043a\u0430 ${direction}`, type), 0);
            return { ...prev, playerPosition: newPos };
          }
        });
        return;
      }
    }

    // non-hero cells (bonus/safe/start)
    setState(prev => {
      const newPos = prev.playerPosition;
      if (newPos === BOARD_SIZE - 1 && !prev.isGameOver) {
        setTimeout(() => addToHistory("Котлыйбыз! Сез финишка җиттегез һәм Алтын карта алдыгыз!", 'success'), 0);
        return {
          ...prev,
          playerPosition: newPos,
          isGameOver: true,
          goldenCards: prev.goldenCards + 1
        };
      }
      return prev;
    });
  }, []);

  const handleAnswer = (index: number) => {
    if (isAnswerChecked) return;
    
    const currentQ = state.isSecondQuestion ? backupQuestion : state.currentEvent;
    const isCorrect = index === currentQ.correctAnswer;
    
    setSelectedAnswerIdx(index);
    setIsAnswerChecked(true);

    setTimeout(() => {
      setSelectedAnswerIdx(null);
      setIsAnswerChecked(false);
      
      if (isCorrect) {
        addToHistory("Дөрес җавап! Алга барыгыз.", 'success');
        setState(prev => ({ ...prev, isAnswering: false, isSecondQuestion: false }));
        setShowModal(false);
      } else {
        if (state.goldenCards > 0) {
          // Алтын карта бар — бер карта алына, өстәмә сорау бирелми
          addToHistory(`1 Тукай картасы алынды`, 'warning');
          setState(prev => ({
            ...prev,
            isAnswering: false,
            isSecondQuestion: false,
            goldenCards: prev.goldenCards - 1,
          }));
          setShowModal(false);
        } else if (!state.isSecondQuestion) {
          addToHistory("Хата! Өстәмә сорауга җавап бирегез.", 'warning');
          const randomBackup = BACKUP_QUESTIONS[Math.floor(Math.random() * BACKUP_QUESTIONS.length)];
          const shuffledBackup = (() => {
            const indexed = randomBackup.a.map((opt: string, i: number) => ({ opt, isCorrect: i === randomBackup.correct }));
            for (let i = indexed.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
            }
            return { options: indexed.map((x: any) => x.opt), correctAnswer: indexed.findIndex((x: any) => x.isCorrect) };
          })();
          setBackupQuestion({
            ...randomBackup,
            correctAnswer: shuffledBackup.correctAnswer,
            options: shuffledBackup.options,
            description: randomBackup.q
          });
          setState(prev => ({ ...prev, isSecondQuestion: true }));
        } else {
          addToHistory(`Яңадан хата! 2 шакмак артка күчү.`, 'error');
          setState(prev => ({
            ...prev,
            isAnswering: false,
            isSecondQuestion: false,
            playerPosition: Math.max(0, prev.playerPosition - 2)
          }));
          setShowModal(false);
        }
      }
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

      addToHistory(TATAR_ROLL_LABEL(roll), 'info');
      setShowModal(true);
    }, 1200);
  };

  const resetGame = () => {
    setState(prev => ({
      playerPosition: 0,
      isGameOver: false,
      history: [{ text: 'Уен яңадан башланды!', type: 'info', icon: <RotateCcw className="w-3 h-3" />, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } as any],
      currentEvent: null,
      isRolling: false,
      diceValue: 1,
      goldenCards: prev.goldenCards,
      isAnswering: false,
      isSecondQuestion: false,
    }));
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
    <div className="min-h-[100dvh] text-emerald-950 font-sans p-1 sm:p-4 md:p-8 flex flex-col items-center pb-12 sm:pb-8 overflow-x-hidden relative bg-emerald-900 sm:bg-emerald-50/95 tatar-pattern bg-fixed">

      {/* ========= CHEAT MENU ========= */}
      <AnimatePresence>
        {showCheat && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-80 select-none"
            style={{
              background: 'linear-gradient(135deg,#0a0a0a,#111827)',
              border: '2px solid #22c55e',
              boxShadow: '0 0 30px rgba(34,197,94,0.3), 0 0 60px rgba(34,197,94,0.1)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-500/30">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 rounded-full bg-green-400"
                />
                <span className="text-green-400 font-mono text-xs font-bold tracking-widest uppercase">DEV CHEAT MODE</span>
              </div>
              <button
                onClick={() => setShowCheat(false)}
                className="text-green-600 hover:text-green-300 font-mono text-sm transition-colors"
              >✕</button>
            </div>

            {/* Hint */}
            <p className="text-green-700 font-mono text-[10px] px-4 pt-2 pb-1 tracking-widest">[F+J] — TOGGLE  |  FOR TESTING ONLY</p>

            {/* Actions */}
            <div className="flex flex-col gap-2 p-4">
              {/* Add 1 card */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#14532d' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setState(prev => ({ ...prev, goldenCards: prev.goldenCards + 1 }));
                  addToHistory('[CHEAT] +1 Тукай Картасы Үұстәленде', 'success');
                }}
                className="w-full py-3 px-4 font-mono text-sm font-bold text-green-300 border border-green-800 text-left transition-colors flex items-center gap-3"
                style={{ background: '#0d1a0d' }}
              >
                <CreditCard className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                +1 Тукай Картасы
                <span className="ml-auto text-green-700 text-[10px]">Сан: {state.goldenCards}</span>
              </motion.button>

              {/* Add 5 cards */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#14532d' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setState(prev => ({ ...prev, goldenCards: prev.goldenCards + 5 }));
                  addToHistory('[CHEAT] +5 Тукай Картасы Үңәйтелде', 'success');
                }}
                className="w-full py-3 px-4 font-mono text-sm font-bold text-green-300 border border-green-800 text-left transition-colors flex items-center gap-3"
                style={{ background: '#0d1a0d' }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                +5 Тукай Картасы
                <span className="ml-auto text-green-700 text-[10px]">Сан: {state.goldenCards}</span>
              </motion.button>

              {/* Teleport to finish */}
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#3b0000' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const finishPos = BOARD_SIZE - 1;
                  setState(prev => ({
                    ...prev,
                    playerPosition: finishPos,
                    isGameOver: true,
                    goldenCards: prev.goldenCards + 1
                  }));
                  addToHistory('[CHEAT] Финишка телепортация!', 'success');
                  setShowCheat(false);
                  setShowModal(false);
                }}
                className="w-full py-3 px-4 font-mono text-sm font-bold text-red-400 border border-red-900 text-left transition-colors flex items-center gap-3"
                style={{ background: '#1a0000' }}
              >
                <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                Финишка телепорт
                <span className="ml-auto text-red-800 text-[10px]">INSTANT WIN</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showWelcome && <WelcomeScreen onStart={() => {
          setShowWelcome(false);
          setShowStartMessage(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />}
      </AnimatePresence>
      <AnimatePresence>
        {showStartMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              className="bg-white border-4 border-emerald-800 p-8 rounded-2xl max-w-2xl w-full text-center shadow-[16px_16px_0px_0px_rgba(6,78,59,1)] relative overflow-hidden"
            >
              <TatarOrnament className="absolute -top-10 -left-10 w-32 h-32 text-emerald-50 opacity-50" />
              <TatarOrnament className="absolute -bottom-10 -right-10 w-32 h-32 text-emerald-50 opacity-50" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tighter text-emerald-900 mb-6" style={{ letterSpacing: '0.05em' }}>Хөрмәтле уенчы!</h3>
                <p className="text-lg text-emerald-800 mb-8 font-medium">
                  Син "Тукай монополиясе"нең башлангыч ноктасында басып торасың. Алда сине мажаралы сәяхәт көтә. Уңышлар сиңа!
                </p>
                <button
                  onClick={() => setShowStartMessage(false)}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black uppercase tracking-widest border-2 border-emerald-900 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none transition-all text-xl"
                >
                  Дәвам итү
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state.isRolling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center w-full h-full bg-black/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-5xl sm:text-8xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] sm:drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] text-center px-4"
            >
              ТЫРС-ТЫРС!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="max-w-5xl w-full mb-0 sm:mb-8 flex flex-row justify-between items-center sm:items-end border-b-2 sm:border-b-4 border-emerald-700 pb-2 sm:pb-4 relative gap-0 bg-emerald-800 sm:bg-transparent p-3 sm:p-0 shadow-lg sm:shadow-none z-50 rounded-b-xl sm:rounded-none">
        <TatarOrnament className="absolute -top-4 -left-4 w-12 h-12 text-emerald-800 opacity-20 hidden md:block" />
        <TatarOrnament className="absolute -top-4 -right-4 w-12 h-12 text-emerald-800 opacity-20 hidden md:block" />
        
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-white sm:text-emerald-900 drop-shadow-sm">Тукай монополиясе</h1>
          <p className="hidden sm:block text-sm font-mono font-bold text-red-600 mt-1">ТУКАЙ ДӨНЬЯСЫ БУЙЛАП СӘЯХӘТ</p>
        </div>
        
        <div className="flex gap-2 sm:gap-4 items-center">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 sm:gap-2 font-black text-[10px] sm:text-base text-white sm:text-emerald-900">
              <CreditCard className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-300 sm:text-emerald-700" />
              <span>{state.goldenCards} <span className="hidden sm:inline">Тукай картасы</span></span>
            </div>
          </div>
          <button 
            onClick={resetGame}
            className="p-1 sm:p-3 sm:hover:bg-emerald-900 sm:hover:text-white transition-all border-2 sm:border-4 border-white sm:border-emerald-900 rounded-none flex items-center gap-1 sm:gap-2 font-black uppercase text-[8px] sm:text-xs bg-emerald-700 sm:bg-white text-white sm:text-emerald-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] sm:shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] active:translate-y-1 active:shadow-none"
          >
            <RotateCcw className="w-2 h-2 sm:w-4 h-4" /> <span className="hidden sm:inline font-black">Яңадан</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8 lg:items-start lg:min-h-[min(calc(100vh-160px),900px)] lg:max-h-[min(calc(100vh-160px),900px)]">
        {/* Board Section */}
        <div className="lg:col-span-3 bg-white border-2 sm:border-4 border-emerald-800 p-0.5 sm:p-2 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] sm:shadow-[16px_16px_0px_0px_rgba(6,78,59,1)] overflow-hidden relative w-full lg:h-full flex items-center justify-center">
          <div className="flex justify-center h-full items-center w-full relative">
            <div className="relative w-full aspect-square max-w-[min(100vw-0.5rem,78vh)] md:max-w-[75vh] lg:max-w-none lg:h-full lg:aspect-square sm:m-0 mx-auto">
              <TatarOrnament className="absolute top-2 left-2 w-8 h-8 text-emerald-100" />
              <TatarOrnament className="absolute top-2 right-2 w-8 h-8 text-emerald-100" />
              <TatarOrnament className="absolute bottom-2 left-2 w-8 h-8 text-emerald-100" />
              <TatarOrnament className="absolute bottom-2 right-2 w-8 h-8 text-emerald-100" />

          <div 
            className="grid grid-cols-11 grid-rows-11 gap-0.5 sm:gap-1 w-full h-full aspect-square"
            style={{ gridTemplateColumns: 'repeat(11, 1fr)', gridTemplateRows: 'repeat(11, 1fr)' }}
          >
            {board.map((cell, idx) => {
              const pos = getGridPos(idx);
              return (
                <div 
                  key={cell.id}
                  style={{ gridRow: pos.row, gridColumn: pos.col }}
                  className={`border-[1px] sm:border-4 flex flex-col items-center justify-center relative transition-all duration-500 group cursor-help ${
                    state.playerPosition === idx 
                      ? 'bg-emerald-900 border-emerald-950 z-20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' 
                      : 'bg-white border-emerald-50 hover:border-emerald-800 hover:z-10 hover:shadow-xl'
                  }`}
                >
                  <div className={`text-[5px] sm:text-[8px] font-mono absolute top-0 sm:top-0.5 left-0 sm:left-0.5 font-bold z-20 ${state.playerPosition === idx ? 'text-emerald-200' : 'text-emerald-400'}`}>
                    {idx.toString().padStart(2, '0')}
                  </div>
                  
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <TatarOrnament className="w-full h-full" variant={idx % 2 === 0 ? 1 : 2} />
                  </div>

                  {state.playerPosition === idx ? (
                    <motion.div 
                      layoutId="player"
                      className="w-5 h-5 sm:w-12 sm:h-12 bg-red-600 rounded-full border-2 sm:border-4 border-white shadow-[0_0_10px_rgba(220,38,38,0.6)] flex items-center justify-center z-30 relative"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute -inset-1 sm:-inset-2 bg-red-500/40 rounded-full animate-ping opacity-75" />
                      <User className="w-3 h-3 sm:w-6 sm:h-6 text-white relative z-10" />
                      <div className="absolute -top-5 sm:-top-8 left-1/2 -translate-x-1/2 bg-emerald-900 text-white text-[5px] sm:text-[8px] px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-black uppercase whitespace-nowrap shadow-lg border border-emerald-700">
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
                    <div className={`absolute z-0 opacity-10 sm:opacity-20 pointer-events-none ${
                      idx < 10 ? 'right-[-4px] sm:right-[-8px] top-1/2 -translate-y-1/2' :
                      idx < 20 ? 'bottom-[-4px] sm:bottom-[-8px] left-1/2 -translate-x-1/2 rotate-90' :
                      idx < 30 ? 'left-[-4px] sm:left-[-8px] top-1/2 -translate-y-1/2 rotate-180' :
                      'top-[-4px] sm:top-[-8px] left-1/2 -translate-x-1/2 -rotate-90'
                    }`}>
                      <ArrowRight className="w-2 h-2 sm:w-4 sm:h-4 text-emerald-900" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Center Content */}
            <div className="col-start-2 col-end-11 row-start-2 row-end-11 flex flex-col items-center justify-center relative overflow-hidden border-2 sm:border-4 border-dashed border-emerald-100 group">
              <img 
                src="https://i.ibb.co/1J9q3chY/photo-2026-04-09-06-52-28.jpg" 
                alt="Тукай Юлы" 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-emerald-950/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
            </div>
          </div>
        </div>
        </div>
        </div>

        {/* Controls & History */}
        <div className="flex flex-col gap-2 sm:gap-6 lg:h-full lg:sticky lg:top-8 w-full max-w-5xl justify-between">
          {/* Dice Control */}
          <div className="bg-white border-2 sm:border-4 border-emerald-800 p-2 sm:p-8 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] sm:shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-3 sm:gap-6 relative overflow-hidden shrink-0">
            <div className="absolute -top-4 -left-4 opacity-5 sm:opacity-10 rotate-45 hidden sm:block">
              <TatarOrnament className="w-16 h-16 text-emerald-900" />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <MiniDice value={state.diceValue} />
              <div className="sm:hidden flex flex-col items-start">
                <span className="text-[7px] font-black uppercase text-emerald-800">Шакмак</span>
                <span className="text-[12px] font-black text-emerald-900 leading-none">№{state.diceValue}</span>
              </div>
            </div>

            <button 
              onClick={rollDice}
              disabled={state.isRolling || state.isGameOver}
              className={`group relative flex-1 sm:w-full py-3 sm:py-5 font-black uppercase tracking-widest border-2 sm:border-4 border-emerald-900 transition-all text-xs sm:text-lg overflow-hidden ${
                state.isRolling || state.isGameOver 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-red-600 text-white sm:hover:bg-red-500 active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {!state.isRolling && !state.isGameOver && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              )}
              <span className="relative z-10">{state.isGameOver ? 'Тәмам' : 'Алга!'}</span>
            </button>
          </div>

          {/* History */}
          <div className="bg-white border-2 sm:border-4 border-emerald-800 p-2 sm:p-6 shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] sm:shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] flex-1 relative flex flex-col min-h-[300px] lg:min-h-0">
            <h3 className="text-[8px] sm:text-xs font-black uppercase tracking-widest text-emerald-800 opacity-70 mb-1 sm:mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <History className="w-3 h-3 sm:w-4 sm:h-4" /> Уен тарихы
              </div>
            </h3>
            
            <div className="flex-1 overflow-y-scroll pr-2 custom-scrollbar space-y-3 scroll-smooth">
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

            <div className="mt-2 sm:mt-6 pt-2 sm:pt-6 border-t-2 sm:border-t-4 border-emerald-50 hidden md:block">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-emerald-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-white border-4 md:border-8 border-emerald-800 p-4 sm:p-12 max-w-2xl w-full shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] md:shadow-[32px_32px_0px_0px_rgba(6,78,59,1)] relative overflow-hidden max-h-[95vh] overflow-y-auto"
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
                    {state.isAnswering ? "Белем тикшерү" : "ЖӘЗА"}
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-emerald-900 leading-none mb-4">
                    {state.isAnswering ? (state.isSecondQuestion ? "Өстәмә сорау!" : "Белем сынавы") : state.currentEvent.title}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-emerald-600/60 font-mono text-xs font-bold">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {state.isAnswering ? "Уенчы" : "Герой"}</span>
                    <span className="w-1 h-1 bg-emerald-200 rounded-full" />
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {state.currentEvent.type === 'question' ? 'сорау' : state.currentEvent.type === 'hero' ? 'герой' : state.currentEvent.type === 'safe' ? 'тынычлык' : state.currentEvent.type === 'bonus' ? 'бонус' : state.currentEvent.type}</span>
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
                  className="text-lg md:text-3xl leading-relaxed text-emerald-950 font-black text-center md:text-left relative z-10"
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
                        whileHover={!isAnswerChecked && window.innerWidth > 640 ? { x: 10, scale: 1.02 } : {}}
                        whileTap={!isAnswerChecked ? { scale: 0.98 } : {}}
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswerChecked}
                        className={`w-full py-3 md:py-5 px-4 md:px-8 border-4 ${borderColor} ${bgColor} ${textColor} font-black uppercase tracking-widest transition-all text-xs md:text-lg text-left flex items-center justify-between group/btn shadow-[4px_4px_0px_0px_rgba(6,78,59,1)] md:shadow-[8px_8px_0px_0px_rgba(6,78,59,1)] ${!isAnswerChecked ? 'sm:hover:shadow-none sm:hover:bg-emerald-800 sm:hover:text-white' : ''}`}
                      >
                        <div className="flex items-center gap-3 md:gap-6">
                          <span className={`w-6 h-6 md:w-10 md:h-10 ${isAnswerChecked ? 'bg-white/20' : 'bg-emerald-100 group-hover/btn:bg-emerald-700'} flex items-center justify-center rounded-full border-2 border-current text-[10px] md:text-sm transition-colors font-mono flex-shrink-0`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-tight">{opt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isAnswerChecked && isCorrect && <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" />}
                          {isAnswerChecked && isSelected && !isCorrect && <XCircle className="w-4 h-4 md:w-6 md:h-6" />}
                          {!isAnswerChecked && (
                            <div className="bg-emerald-100 group-hover/btn:bg-emerald-700 p-1 md:p-2 rounded-full transition-colors hidden sm:block">
                              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-4 group-hover/btn:translate-x-0" />
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
              
              <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 drop-shadow-lg">Җиңү!</h1>
              
              <div className="relative mb-12 group" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-6 bg-yellow-400 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
                <motion.div
                  animate={{ rotateY: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 5, ease: [0.4, 0, 0.6, 1], times: [0, 0.5, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="w-72 h-44 relative"
                >
                  {/* Front face */}
                  <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-amber-600 rounded-2xl border-4 border-yellow-100 shadow-2xl flex flex-col items-center justify-center p-5 text-emerald-900"
                  >
                    <div className="absolute top-2 left-2 opacity-20"><TatarOrnament className="w-8 h-8" /></div>
                    <div className="absolute bottom-2 right-2 opacity-20"><TatarOrnament className="w-8 h-8" /></div>
                    <div className="flex items-center gap-3 w-full mb-2">
                      <div className="w-12 h-12 bg-white/40 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white/60 shadow-inner">
                        <img
                          src="https://avatars.mds.yandex.net/i?id=84c7c28b2d73e2684e67d3867411fe209c0d8277-8310551-images-thumbs&n=13"
                          alt="Tuqay"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-left leading-tight">
                        <span className="font-bold uppercase tracking-widest text-[9px] block opacity-60 mb-0.5">Тукай Картасы</span>
                        <span className="font-black uppercase tracking-tight text-base leading-none">Габдулла Тукай</span>
                      </div>
                    </div>
                    <div className="w-full h-px bg-emerald-900/20 my-1" />
                    <div className="flex items-center justify-between w-full px-1 mt-1">
                      <div className="flex items-center gap-1 font-black text-xl">
                        <CreditCard className="w-5 h-5 text-yellow-700" />
                        <span>TUQAY</span>
                      </div>
                      <div className="text-[10px] font-mono font-bold opacity-40">
                        1826 – 1913
                      </div>
                    </div>
                  </div>
                  {/* Back face */}
                  <div
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-600 via-yellow-400 to-yellow-200 rounded-2xl border-4 border-yellow-100 shadow-2xl flex flex-col items-center justify-center p-5 text-emerald-900"
                  >
                    <TatarOrnament className="w-20 h-20 text-emerald-900/20" variant={2} />
                    <span className="font-black text-sm uppercase tracking-widest mt-2 opacity-70">ТУКАЙ МОНОПОЛИЯСЕ</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-6 -right-6 bg-red-600 text-white text-sm font-black px-4 py-2 uppercase tracking-widest rotate-12 shadow-xl border-2 border-white"
                >
                  Җиңүче Картасы
                </motion.div>
              </div>

              <p className="text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-2xl leading-relaxed text-emerald-50 px-4">
                Сез Тукай дөньясын яхшы беләсез! Сезгә Тукай Картасы бирелә!
              </p>

              <button 
                onClick={resetGame}
                className="group relative px-10 md:px-20 py-6 md:py-8 bg-white text-emerald-900 font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,0.3)] text-xl md:text-3xl active:translate-y-2 active:shadow-none overflow-hidden"
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
