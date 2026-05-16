/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, User, ArrowRight, Grid3X3, Trash2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
}

export default function App() {
  const [maleNames, setMaleNames] = useState('');
  const [femaleNames, setFemaleNames] = useState('');
  const [cols, setCols] = useState(6);
  const [seats, setSeats] = useState<(Student | null)[]>([]);

  const parseNames = (text: string) => {
    return text
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n !== '');
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleShuffle = () => {
    const males = parseNames(maleNames).map((name) => ({
      id: `m-${Math.random()}`,
      name,
      gender: 'male' as const,
    }));
    const females = parseNames(femaleNames).map((name) => ({
      id: `f-${Math.random()}`,
      name,
      gender: 'female' as const,
    }));

    if (males.length === 0 && females.length === 0) {
      alert('학생 이름을 입력해 주세요.');
      return;
    }

    const allStudents = shuffle([...males, ...females]);
    
    // Calculate how many empty seats needed to fill the grid
    const totalDesks = Math.ceil(allStudents.length / cols) * cols;
    const finalSeats: (Student | null)[] = [...allStudents];
    
    while (finalSeats.length < totalDesks) {
      finalSeats.push(null);
    }

    setSeats(finalSeats);
  };

  const clearInputs = () => {
    if (confirm('모든 입력 내용을 지우시겠습니까?')) {
      setMaleNames('');
      setFemaleNames('');
      setSeats([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto h-screen flex flex-col md:flex-row shadow-2xl bg-white overflow-hidden">
        {/* Left Panel: Settings */}
        <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="p-6 border-bottom border-slate-100 bg-blue-600 text-white">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Grid3X3 className="w-6 h-6" />
              학급 자리 배치
            </h1>
            <p className="text-xs text-blue-100 mt-1">중학교 3학년 담임선생님을 위한 툴</p>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Male Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                남학생 명단 (Enter/쉼표 구분)
              </label>
              <textarea
                value={maleNames}
                onChange={(e) => setMaleNames(e.target.value)}
                placeholder="홍길동, 김철수..."
                className="w-full h-32 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none leading-relaxed"
              />
            </div>

            {/* Female Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                여학생 명단 (Enter/쉼표 구분)
              </label>
              <textarea
                value={femaleNames}
                onChange={(e) => setFemaleNames(e.target.value)}
                placeholder="이영희, 박지민..."
                className="w-full h-32 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all outline-none leading-relaxed"
              />
            </div>

            {/* Config */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                한 줄(열)당 책상 수
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="text-lg font-bold text-blue-600 w-8">{cols}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-3">
            <button
              id="start-button"
              onClick={handleShuffle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              자리 배치 시작!
            </button>
            <button
              id="clear-button"
              onClick={clearInputs}
              className="w-full bg-white hover:bg-slate-100 text-slate-500 font-medium py-2 rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              초기화
            </button>
          </div>
        </aside>

        {/* Right Panel: Results */}
        <main className="flex-1 bg-slate-100 relative overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Chalkboard */}
            <div id="chalkboard" className="mx-auto w-full max-w-2xl bg-[#1a472a] border-[12px] border-[#3e2723] rounded-sm p-6 shadow-xl relative mt-4">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>
              <div className="text-center">
                <div className="inline-block px-4 py-1 border-2 border-white/30 rounded text-white/50 text-xs font-mono mb-4">
                  TEACHER'S DESK AREA
                </div>
                <h2 className="font-board text-4xl md:text-5xl text-white tracking-widest drop-shadow-md">
                  칠 판 (Chalkboard)
                </h2>
              </div>
              <div className="absolute -bottom-1 right-12 w-8 h-2 bg-white/90 rounded-full blur-[1px]"></div>
              <div className="absolute -bottom-1 right-24 w-6 h-2 bg-rose-200/90 rounded-full blur-[1px]"></div>
            </div>

            {/* Seat Grid */}
            <div 
              id="seat-grid"
              className="grid gap-3 md:gap-4 mx-auto w-full"
              style={{ 
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
              }}
            >
              <AnimatePresence mode="popLayout">
                {seats.length > 0 ? (
                  seats.map((student, idx) => (
                    <motion.div
                      key={student?.id || `empty-${idx}`}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 260, 
                        damping: 20,
                        delay: idx * 0.02
                      }}
                      className={`
                        aspect-square md:aspect-video rounded-lg border-2 flex flex-col items-center justify-center p-2 shadow-sm
                        ${!student 
                          ? 'border-dashed border-slate-300 bg-slate-200/50' 
                          : student.gender === 'male'
                            ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100'
                            : 'bg-rose-50 border-rose-200 text-rose-900 shadow-rose-100'
                        }
                      `}
                    >
                      {student ? (
                        <>
                          <User className={`w-4 h-4 md:w-5 md:h-5 mb-1 ${student.gender === 'male' ? 'text-blue-400' : 'text-rose-300'}`} />
                          <span className="text-xs md:text-sm font-bold truncate max-w-full">
                            {student.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] md:text-xs text-slate-400 font-medium">빈자리</span>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl mt-10">
                    <ArrowRight className="w-8 h-8 mb-2 animate-pulse" />
                    <p className="font-medium text-lg">왼쪽에서 명단을 입력하고</p>
                    <p className="text-sm">배치 버튼을 눌러주세요</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

