import React, { useEffect, useRef, useState } from 'react';
import '../styles/site.css';

const totalChambers = 6;
const cardOptions = ['A', 'K', 'Q'];

const Game: React.FC = () => {
  const [card, setCard] = useState<string>('A');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const shuffleInterval = useRef<number | undefined>(undefined);
  const [shotsTaken, setShotsTaken] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const bulletPositionRef = useRef<number>(Math.floor(Math.random() * totalChambers));
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [splatters, setSplatters] = useState<{ id: number; src: string; style: React.CSSProperties }[]>([]);

  const cylinderRef = useRef<HTMLDivElement>(null);
  const damageOverlayRef = useRef<HTMLDivElement>(null);
  const bloodContainerRef = useRef<HTMLDivElement>(null);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const chimeSoundRef = useRef<HTMLAudioElement>(null);
  const gunshotSoundRef = useRef<HTMLAudioElement>(null);
  const emptyClickSoundRef = useRef<HTMLAudioElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    updateCylinder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateCylinder();
  }, [shotsTaken, isGameOver]);

  const updateCylinder = () => {
    for (let i = 0; i < totalChambers; i++) {
      const chamberEl = document.getElementById(`chamber${i}`);
      if (chamberEl) {
        if (i < shotsTaken) chamberEl.classList.add('shot');
        else chamberEl.classList.remove('shot');
      }
    }
    const remaining = totalChambers - shotsTaken;
    const chanceEl = document.getElementById('deathChance');
    if (chanceEl) chanceEl.textContent = `${remaining > 0 ? (100 / remaining).toFixed(2) : '100'}%`;
    if (isGameOver) {
      damageOverlayRef.current?.classList.remove('beating');
    } else if (remaining === 1) {
      if (damageOverlayRef.current) damageOverlayRef.current.style.display = 'block';
      damageOverlayRef.current?.classList.add('beating');
    }
  };

  const clearSplatters = () => setSplatters([]);

  const generateSplatters = () => {
    const count = 8 + Math.floor(Math.random() * 2); // 8 or 9
    const images = ['splatt1.svg', 'splatt2.svg', 'splatt3.svg'];
    const newSplatters = Array.from({ length: count }, (_, i) => {
      const size = 80 + Math.floor(Math.random() * 120); // 80px to 200px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const rotate = Math.random() * 360;
      const opacity = 0.5 + Math.random() * 0.3;
      const src = images[Math.floor(Math.random() * images.length)];
      return {
        id: i,
        src,
        style: {
          position: 'fixed',
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          opacity,
          pointerEvents: 'none',
          filter: 'brightness(0.8)',
        } as React.CSSProperties,
      };
    });
    setSplatters(newSplatters);
  };

  const resetGame = () => {
    setShotsTaken(0);
    setIsGameOver(false);
    bulletPositionRef.current = Math.floor(Math.random() * totalChambers);
    if (damageOverlayRef.current) damageOverlayRef.current.style.display = 'none';
    damageOverlayRef.current?.classList.remove('beating');
    if (bloodContainerRef.current) bloodContainerRef.current.style.display = 'none';
    const btnSpan = document.querySelector('#pullTriggerBtn span');
    if (btnSpan) btnSpan.textContent = 'FIRE';
    updateCylinder();
    clearSplatters();
  };

  const handleCardClick = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    const options = [...cardOptions];
    const cardEl = document.getElementById('card');
    shuffleInterval.current = window.setInterval(() => {
      const val = options[Math.floor(Math.random() * options.length)];
      if (cardEl) cardEl.textContent = val;
    }, 100);
    cardEl?.classList.add('flip');
    clickSoundRef.current?.play();
    setTimeout(() => {
      clearInterval(shuffleInterval.current);
      const val = options[Math.floor(Math.random() * options.length)];
      setCard(val);
      if (cardEl) {
        cardEl.textContent = val;
        cardEl.classList.add('selected');
      }
      chimeSoundRef.current?.play();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(
          val === 'Q' ? 'Queen' : val === 'K' ? 'King' : 'Ace'
        );
        utterance.lang = 'en-US';
        utterance.rate = 0.5;
        window.speechSynthesis.speak(utterance);
      }, 300);
      setTimeout(() => {
        if (cardEl) {
          cardEl.classList.remove('selected');
          cardEl.classList.remove('flip');
        }
        setIsFlipping(false);
      }, 2000);
    }, 2000);
  };

  const handleFire = () => {
    if (isButtonDisabled) return;
    if (isGameOver) {
      resetGame();
      return;
    }
    if (spinSoundRef.current) {
      spinSoundRef.current.pause();
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }
    setIsSpinning(true);
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsSpinning(false);
      const currentShots = shotsTaken;
      setShotsTaken(currentShots + 1);
      if (bulletPositionRef.current === currentShots) {
        if (gunshotSoundRef.current) {
          gunshotSoundRef.current.pause();
          gunshotSoundRef.current.currentTime = 0;
          gunshotSoundRef.current.play();
        }
        setIsGameOver(true);
        if (bloodContainerRef.current) bloodContainerRef.current.style.display = 'block';
        if (damageOverlayRef.current) damageOverlayRef.current.style.display = 'block';
        damageOverlayRef.current?.classList.remove('beating');
        const btnSpan = document.querySelector('#pullTriggerBtn span');
        if (btnSpan) btnSpan.textContent = 'RESET';
        generateSplatters();
      } else {
        if (emptyClickSoundRef.current) {
          emptyClickSoundRef.current.pause();
          emptyClickSoundRef.current.currentTime = 0;
          emptyClickSoundRef.current.play();
        }
      }
      setIsButtonDisabled(false);
    }, 3000);
  };

  return (
    <>
      <div className="container">
        <h1>Liar's Bar Russian Roulette Simulation</h1>
        <div className="card-container">
          <div className="card" id="card" onClick={handleCardClick}>
            {card}
          </div>
        </div>
        <div className="divider"></div>
        <div className="cylinder-container">
          <div className={`cylinder ${isSpinning ? 'spin' : ''}`} id="cylinder" ref={cylinderRef}>
            {[0, 5, 1, 4, 2, 3].map(i => (
              <div key={i} className="chamber" id={`chamber${i}`}></div>
            ))}
            <div className="outer-ring"></div>
            {['one', 'two', 'three', 'four', 'five', 'six'].map((slot, idx) => (
              <div key={idx} className={`revolver-slot slot-${slot}`}></div>
            ))}
          </div>
        </div>
      </div>
      <div className="shot-info">
        <div className="shot-count">
          <img src="/assets/img/revolver.png" alt="Chambers remaining" />
          <span id="shotCount">{shotsTaken}/{totalChambers}</span>
        </div>
        <div className="death-chance">
          <img src="/assets/img/skull.png" alt="Chance of dying" />
          <span id="deathChance">0%</span>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button id="pullTriggerBtn" disabled={isButtonDisabled} onClick={handleFire}>
          <span>{isGameOver ? 'RESET' : 'FIRE'}</span>
        </button>
      </div>
      <audio id="clickSound" ref={clickSoundRef} src="/assets/mp3/click.mp3" preload="auto" />
      <audio id="chimeSound" ref={chimeSoundRef} src="/assets/mp3/chime.mp3" preload="auto" />
      <audio id="gunshotSound" ref={gunshotSoundRef} src="/assets/mp3/gunshot.mp3" preload="auto" />
      <audio id="emptyClickSound" ref={emptyClickSoundRef} src="/assets/mp3/empty-gunshot.mp3" preload="auto" />
      <audio id="spinSound" ref={spinSoundRef} src="/assets/mp3/revolver-spin.mp3" preload="auto" />
      <div className="damage-warning" id="damageOverlay" ref={damageOverlayRef}></div>
      <div id="blood-splatter-container" ref={bloodContainerRef}>
        {splatters.map(s => (
          <img key={s.id} src={`/assets/img/${s.src}`} style={s.style} alt="splatter" />
        ))}
      </div>
    </>
  );
};

export default Game; 