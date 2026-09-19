import React, { useState } from 'react';
import { Calculator, Lock, Activity, RefreshCw } from 'lucide-react';

interface PanicScreenProps {
  onExitCamouflage: () => void;
}

export const PanicScreen: React.FC<PanicScreenProps> = ({ onExitCamouflage }) => {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);

  // Quick Clinical BMI tool
  const [weight, setWeight] = useState('68');
  const [heightCm, setHeightCm] = useState('172');

  const handleNum = (num: string) => {
    setCalcDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOp = (op: string) => {
    setPrevVal(parseFloat(calcDisplay));
    setOperation(op);
    setCalcDisplay('0');
  };

  const handleEqual = () => {
    if (prevVal === null || !operation) return;
    const current = parseFloat(calcDisplay);
    let res = 0;
    if (operation === '+') res = prevVal + current;
    if (operation === '-') res = prevVal - current;
    if (operation === '×') res = prevVal * current;
    if (operation === '÷') res = current !== 0 ? prevVal / current : 0;
    setCalcDisplay(res.toString());
    setPrevVal(null);
    setOperation(null);
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setPrevVal(null);
    setOperation(null);
  };

  const calcBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(heightCm) / 100;
    if (!w || !h) return 22.9;
    return (w / (h * h)).toFixed(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-[#171c1f] flex flex-col p-4 max-w-md mx-auto overflow-y-auto">
      {/* Top Disguised Header */}
      <div className="flex items-center justify-between py-2 border-b border-[#eaeef2] mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#006d43]" />
          <h2 className="text-sm font-black text-[#001026]">Clinical Dosage & BMI Calculator</h2>
        </div>

        {/* Discreet Secret Exit Button (looks like a normal small widget lock) */}
        <button
          onClick={onExitCamouflage}
          className="p-1.5 rounded-full text-[#74777f] hover:text-[#001026] hover:bg-[#eaeef2] transition-colors"
          title="Exit Camouflage"
          type="button"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>

      {/* Disguised Calculator */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2] mb-4">
        <div className="bg-[#f0f4f8] rounded-xl p-3 text-right text-2xl font-mono font-bold text-[#001026] mb-3">
          {calcDisplay}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['C', '÷', '×', '-'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === 'C' ? handleClear() : handleOp(btn))}
              className="h-10 rounded-xl bg-[#f0f4f8] hover:bg-[#e5e9ed] font-bold text-xs text-[#001026]"
              type="button"
            >
              {btn}
            </button>
          ))}
          {['7', '8', '9', '+'].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '+' ? handleOp(btn) : handleNum(btn))}
              className="h-10 rounded-xl bg-white border border-[#eaeef2] hover:bg-[#f0f4f8] font-bold text-xs text-[#001026]"
              type="button"
            >
              {btn}
            </button>
          ))}
          {['4', '5', '6', '='].map((btn) => (
            <button
              key={btn}
              onClick={() => (btn === '=' ? handleEqual() : handleNum(btn))}
              className={`h-10 rounded-xl font-bold text-xs ${
                btn === '=' ? 'bg-[#006d43] text-white hover:bg-[#005333]' : 'bg-white border border-[#eaeef2] hover:bg-[#f0f4f8] text-[#001026]'
              }`}
              type="button"
            >
              {btn}
            </button>
          ))}
          {['1', '2', '3', '0'].map((btn) => (
            <button
              key={btn}
              onClick={() => handleNum(btn)}
              className="h-10 rounded-xl bg-white border border-[#eaeef2] hover:bg-[#f0f4f8] font-bold text-xs text-[#001026]"
              type="button"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Disguised BMI & Pediatric Dose Reference */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#eaeef2] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#001026]">
          Patient BMI & Surface Area (BSA)
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="block text-[#44474e] mb-1">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[#eaeef2] bg-[#f8fafc]"
            />
          </div>
          <div>
            <label className="block text-[#44474e] mb-1">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-[#eaeef2] bg-[#f8fafc]"
            />
          </div>
        </div>

        <div className="p-3 bg-[#f0f4f8] rounded-xl flex items-center justify-between text-xs">
          <span className="text-[#44474e]">Calculated BMI:</span>
          <span className="font-bold text-sm text-[#006d43]">{calcBmi()} kg/m² (Normal)</span>
        </div>
      </div>
    </div>
  );
};
