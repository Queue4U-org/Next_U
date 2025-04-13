import { useEffect, useRef } from 'react';

export const PlantGame = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Pet Plant</title>
  <style>
    :root {
      --soil-color: #612e0a;
      --pot-color: #3b1909;
      --water-blue: #ffffff;
      --sun-yellow: #9e8c27;
      --spring-color: #0b0425;
      --summer-color: #7e5a18;
      --autumn-color: #D2691E;
      --winter-color: #6871b6;
    }
    
    body {
      font-family: 'Comic Sans MS', cursive, sans-serif;
      background: linear-gradient(to bottom, #000000, #06093d);
      height: 100vh;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
      transition: background 1s ease;
    }
    
    body.spring { background: linear-gradient(to bottom, #05081d, var(--spring-color)); }
    body.summer { background: linear-gradient(to bottom, #293299, var(--summer-color)); }
    body.autumn { background: linear-gradient(to bottom, #040120, var(--autumn-color)); }
    body.winter { background: linear-gradient(to bottom, #040725, var(--winter-color)); }
    
    .container {
      position: relative;
      width: 300px;
      height: 400px;
    }
    
    .pot {
      position: absolute;
      bottom: 0;
      width: 200px;
      height: 150px;
      background: var(--pot-color);
      border-radius: 0 0 20px 20px;
      left: 50px;
    }
    
    .pot-top {
      position: absolute;
      bottom: 150px;
      width: 220px;
      height: 30px;
      background: var(--pot-color);
      border-radius: 10px;
      left: 40px;
    }
    
    .soil {
      position: absolute;
      bottom: 30px;
      width: 180px;
      height: 120px;
      background: var(--soil-color);
      border-radius: 0 0 15px 15px;
      left: 60px;
    }
    
    .plant {
      position: absolute;
      bottom: 150px;
      left: 150px;
      transform-origin: bottom center;
    }
    
    .seed {
      width: 20px;
      height: 20px;
      background: #8B4513;
      border-radius: 50%;
      bottom: 140px;
    }
    
    .sprout {
      width: 5px;
      height: 30px;
      background: #2E8B57;
      border-radius: 5px;
    }
    
    .sprout::before, .sprout::after {
      content: '';
      position: absolute;
      width: 15px;
      height: 5px;
      background: #2E8B57;
      top: 10px;
      border-radius: 5px;
    }
    
    .sprout::before {
      transform: rotate(30deg);
      left: -10px;
    }
    
    .sprout::after {
      transform: rotate(-30deg);
      right: -10px;
    }
    
    .small-plant {
      width: 8px;
      height: 60px;
      background: #3CB371;
      border-radius: 5px;
    }
    
    .small-plant::before, .small-plant::after {
      content: '';
      position: absolute;
      width: 25px;
      height: 8px;
      background: #3CB371;
      top: 20px;
      border-radius: 5px;
    }
    
    .small-plant::before {
      transform: rotate(25deg);
      left: -15px;
    }
    
    .small-plant::after {
      transform: rotate(-25deg);
      right: -15px;
    }
    
    .medium-plant {
      width: 10px;
      height: 100px;
      background: #228B22;
      border-radius: 5px;
    }
    
    .medium-plant::before, .medium-plant::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 10px;
      background: #228B22;
      top: 30px;
      border-radius: 5px;
    }
    
    .medium-plant::before {
      transform: rotate(20deg);
      left: -25px;
    }
    
    .medium-plant::after {
      transform: rotate(-20deg);
      right: -25px;
    }
    
    .large-plant {
      width: 12px;
      height: 150px;
      background: #006400;
      border-radius: 5px;
    }
    
    .large-plant::before, .large-plant::after {
      content: '';
      position: absolute;
      width: 60px;
      height: 12px;
      background: #006400;
      top: 50px;
      border-radius: 5px;
    }
    
    .large-plant::before {
      transform: rotate(15deg);
      left: -40px;
    }
    
    .large-plant::after {
      transform: rotate(-15deg);
      right: -40px;
    }
    
    .flower {
      width: 12px;
      height: 180px;
      background: #006400;
      border-radius: 5px;
    }
    
    .flower::before, .flower::after {
      content: '';
      position: absolute;
      width: 80px;
      height: 12px;
      background: #006400;
      top: 70px;
      border-radius: 5px;
    }
    
    .flower::before {
      transform: rotate(10deg);
      left: -60px;
    }
    
    .flower::after {
      transform: rotate(-10deg);
      right: -60px;
    }
    
    .flower-top {
      position: absolute;
      width: 30px;
      height: 30px;
      background: #FF69B4;
      border-radius: 50%;
      top: -15px;
      left: -9px;
    }
    
    .flower-top::before {
      content: '✿';
      position: absolute;
      font-size: 20px;
      color: yellow;
      top: 5px;
      left: 5px;
    }
    
    .cactus {
      width: 15px;
      height: 100px;
      background: #3CB371;
      border-radius: 5px;
      position: relative;
    }
    
    .cactus::before, .cactus::after {
      content: '';
      position: absolute;
      width: 30px;
      height: 15px;
      background: #3CB371;
      border-radius: 15px;
    }
    
    .cactus::before {
      top: 30px;
      left: -25px;
    }
    
    .cactus::after {
      top: 60px;
      right: -25px;
    }
    
    .fern {
      width: 8px;
      height: 120px;
      background: #2E8B57;
      border-radius: 5px;
    }
    
    .fern::before, .fern::after {
      content: '';
      position: absolute;
      width: 50px;
      height: 5px;
      background: #2E8B57;
      top: 20px;
      border-radius: 5px;
      transform-origin: left center;
    }
    
    .fern::before {
      transform: rotate(20deg);
      left: 0;
    }
    
    .fern::after {
      transform: rotate(-20deg);
      right: 0;
    }
    
    .fern-leaf {
      position: absolute;
      width: 40px;
      height: 5px;
      background: #2E8B57;
      border-radius: 5px;
      transform-origin: left center;
    }
    
    .sun {
      position: absolute;
      width: 80px;
      height: 80px;
      background: var(--sun-yellow);
      border-radius: 50%;
      top: 50px;
      right: 50px;
      box-shadow: 0 0 40px var(--sun-yellow);
      animation: sunMove 30s linear infinite;
    }
    
    @keyframes sunMove {
      0% { transform: translateX(100px) rotate(0deg); }
      100% { transform: translateX(-100px) rotate(360deg); }
    }
    
    .water-btn {
      margin-top: 20px;
      padding: 10px 20px;
      background: var(--water-blue);
      color: rgb(0, 0, 0);
      border: none;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: all 0.3s;
    }
    
    .water-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }
    
    .water-btn:active {
      transform: translateY(1px);
    }
    
    .water-drop {
      position: absolute;
      width: 10px;
      height: 15px;
      background: var(--water-blue);
      border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
      opacity: 0.7;
      animation: waterDrop 1s linear forwards;
    }
    
    @keyframes waterDrop {
      0% { transform: translateY(-50px); opacity: 0; }
      50% { opacity: 0.7; }
      100% { transform: translateY(150px); opacity: 0; }
    }
    
    .stats {
      margin-top: 20px;
      background: rgb(255, 255, 255);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      width: 300px;
    }
    
    .progress-container {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    
    .progress-label {
      width: 100px;
      text-align: left;
      font-size: 14px;
    }
    
    .progress-bar {
      flex-grow: 1;
      height: 15px;
      background: #ddd;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .progress {
      height: 100%;
      transition: width 0.5s;
    }
    
    .health-bar { background: linear-gradient(to right, #FF6347, #FFA07A); }
    .hydration-bar { background: linear-gradient(to right, #1E90FF, #87CEFA); }
    .happiness-bar { background: linear-gradient(to right, #FFD700, #FFFACD); }
    .growth-bar { background: linear-gradient(to right, #4CAF50, #8BC34A); }
    
    .message {
      margin-top: 20px;
      padding: 10px;
      background: rgba(255,255,255,0.8);
      border-radius: 10px;
      animation: fadeIn 1s;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .day-counter {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgb(255, 255, 255);
      padding: 10px 15px;
      border-radius: 5px;
      font-weight: bold;
    }
    
    .plant-selection {
      margin-bottom: 20px;
      background: rgb(255, 255, 255);
      padding: 15px;
      border-radius: 5px;
      display: none;
    }
    
    .plant-option {
      margin: 5px;
      padding: 8px 15px;
      background: #050220;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .plant-option:hover {
      transform: scale(1.05);
    }
    
    .share-btn {
      margin-top: 10px;
      font-size: larger;
      padding: 10px 20px;
      background: #040131;
      color: rgb(255, 255, 255);
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .share-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .achievement {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 215, 0, 0.9);
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      z-index: 100;
      display: none;
      animation: achievementPop 1s;
    }
    
    @keyframes achievementPop {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.1); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    .snowflake, .leaf, .petal {
      position: absolute;
      pointer-events: none;
      z-index: 10;
    }
    
    .snowflake { color: white; }
    .leaf { color: var(--autumn-color); }
    .petal { color: pink; }
    
    @media (max-width: 600px) {
      .container {
        width: 250px;
        height: 350px;
      }
      
      .pot {
        width: 160px;
        height: 120px;
        left: 45px;
      }
      
      .pot-top {
        width: 180px;
        left: 35px;
        bottom: 120px;
      }
      
      .soil {
        width: 140px;
        left: 55px;
      }
      
      .stats {
        width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="day-counter">Day: <span id="dayCount">0</span></div>
  
  <div class="plant-selection" id="plantSelection">
    <h3>Choose Your Plant:</h3>
    <button class="plant-option" data-type="flower">🌺 Flower</button>
    <button class="plant-option" data-type="cactus">🌵 Cactus</button>
    <button class="plant-option" data-type="fern">🌿 Fern</button>
  </div>
  
  <div class="container">
    <div class="sun"></div>
    <div class="pot"></div>
    <div class="pot-top"></div>
    <div class="soil"></div>
    <div class="plant" id="plant"></div>
  </div>
  
  <button class="water-btn" id="waterBtn">💧 Water Plant</button>
  
  <div class="stats">
    <h2 style="color: #000000">Your Pet Plant</h2>
    <div class="progress-container">
      <div class="progress-label" style="color: #000000">Health:</div>
      <div class="progress-bar">
        <div class="progress health-bar" id="healthBar"></div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-label" style="color: #000000">Hydration:</div>
      <div class="progress-bar">
        <div class="progress hydration-bar" id="hydrationBar"></div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-label" style="color: #000000">Happiness:</div>
      <div class="progress-bar">
        <div class="progress happiness-bar" id="happinessBar"></div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-label" style="color: #000000">Growth:</div>
      <div class="progress-bar">
        <div class="progress growth-bar" id="growthBar"></div>
      </div>
    </div>
    <div class="message" id="message">Welcome! Water your plant daily to help it grow!</div>
    <button class="share-btn" id="shareBtn">📷 Share Your Plant</button>
  </div>

  <div class="achievement" id="achievement">
    <h3>Achievement Unlocked!</h3>
    <p id="achievementText"></p>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const plant = document.getElementById('plant');
      const waterBtn = document.getElementById('waterBtn');
      const healthBar = document.getElementById('healthBar');
      const hydrationBar = document.getElementById('hydrationBar');
      const happinessBar = document.getElementById('happinessBar');
      const growthBar = document.getElementById('growthBar');
      const messageEl = document.getElementById('message');
      const dayCountEl = document.getElementById('dayCount');
      const plantSelection = document.getElementById('plantSelection');
      const shareBtn = document.getElementById('shareBtn');
      const achievementEl = document.getElementById('achievement');
      const achievementText = document.getElementById('achievementText');
      
      const plantTypes = {
        flower: [
          { class: 'seed', days: 1, message: "It's a seed! Keep watering daily." },
          { class: 'sprout', days: 2, message: "Your seed sprouted! It's a baby plant now." },
          { class: 'small-plant', days: 3, message: "Look at it grow! Getting bigger every day." },
          { class: 'medium-plant', days: 5, message: "Your plant is thriving! So green and healthy." },
          { class: 'large-plant', days: 7, message: "Wow! What a beautiful plant you've grown!" },
          { class: 'flower', days: 10, message: "🌸 Congratulations! Your plant has flowered! 🌸" }
        ],
        cactus: [
          { class: 'seed', days: 1, message: "It's a cactus seed! Water carefully." },
          { class: 'sprout', days: 3, message: "Your cactus is sprouting! So tiny." },
          { class: 'small-plant', days: 6, message: "Your cactus is growing spines!" },
          { class: 'cactus', days: 10, message: "Your cactus is looking prickly and proud!" },
          { class: 'cactus', days: 15, message: "Your cactus is thriving in the virtual desert!" }
        ],
        fern: [
          { class: 'seed', days: 1, message: "Fern spores planted! Keep the environment humid." },
          { class: 'sprout', days: 2, message: "Tiny fern fronds are emerging!" },
          { class: 'fern', days: 4, message: "Your fern is developing beautiful fronds." },
          { class: 'fern', days: 7, message: "The fern is getting lush and full!" },
          { class: 'fern', days: 12, message: "Your fern is a gorgeous green fountain!" }
        ]
      };
      
      const achievements = [
        { id: 'first_water', name: 'First Step', desc: 'Water your plant for the first time' },
        { id: 'three_days', name: 'Green Thumb', desc: 'Water your plant for 3 consecutive days' },
        { id: 'week_streak', name: 'Dedicated Gardener', desc: 'Water your plant for 7 consecutive days' },
        { id: 'flower', name: 'Master Florist', desc: 'Grow a flower to full bloom' },
        { id: 'cactus', name: 'Desert Expert', desc: 'Successfully grow a cactus' },
        { id: 'fern', name: 'Jungle Keeper', desc: 'Successfully grow a fern' }
      ];
      
      let plantData = JSON.parse(localStorage.getItem('plantData')) || {
        lastWatered: null,
        daysWatered: 0,
        stage: 0,
        consecutiveDays: 0,
        health: 100,
        hydration: 100,
        happiness: 100,
        type: null,
        achievements: [],
        needsUpdate: false
      };
      
      if (plantData.type === null) {
        plantSelection.style.display = 'block';
        messageEl.textContent = "Choose your first plant!";
      } else {
        applySeasonalEffects();
        updatePlant();
      }
      
      document.querySelectorAll('.plant-option').forEach(function(button) {
        button.addEventListener('click', function() {
          plantData.type = this.getAttribute('data-type');
          plantData.daysWatered = 0;
          plantData.stage = 0;
          plantData.health = 100;
          plantData.hydration = 100;
          plantData.happiness = 100;
          plantSelection.style.display = 'none';
          localStorage.setItem('plantData', JSON.stringify(plantData));
          updatePlant();
          applySeasonalEffects();
          showMessage('You planted a ' + plantData.type + '! Water it daily to help it grow.');
        });
      });
      
      const today = new Date().toDateString();
      const lastWateredDate = plantData.lastWatered ? new Date(plantData.lastWatered).toDateString() : null;
      
      if (lastWateredDate && lastWateredDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastWateredDate !== yesterday.toDateString()) {
          plantData.consecutiveDays = 0;
          plantData.happiness = Math.max(0, plantData.happiness - 20);
          plantData.health = Math.max(0, plantData.health - 10);
          plantData.needsUpdate = true;
          showMessage("You missed a day! Your plant is a bit sad. Try to water daily for best growth.");
        }
      }
      
      function updatePlant() {
        if (!plantData.type) return;
        
        const stages = plantTypes[plantData.type];
        let currentStage = 0;
        for (let i = stages.length - 1; i >= 0; i--) {
          if (plantData.daysWatered >= stages[i].days) {
            currentStage = i;
            break;
          }
        }
        
        plantData.stage = currentStage;
        plant.className = 'plant ' + stages[currentStage].class;
        
        if (plantData.type === 'flower' && currentStage === stages.length - 1) {
          const flowerTop = document.createElement('div');
          flowerTop.className = 'flower-top';
          if (!plant.querySelector('.flower-top')) {
            plant.appendChild(flowerTop);
          }
        } else if (plantData.type === 'fern') {
          plant.innerHTML = '';
          const stem = document.createElement('div');
          stem.className = 'plant fern';
          plant.appendChild(stem);
          
          for (let i = 0; i < 5; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'fern-leaf';
            leaf.style.top = (20 + i * 20) + 'px';
            leaf.style.transform = 'rotate(' + (15 + i * 5) + 'deg)';
            leaf.style.width = (30 + i * 10) + 'px';
            plant.appendChild(leaf);
          }
        }
        
        healthBar.style.width = plantData.health + '%';
        hydrationBar.style.width = plantData.hydration + '%';
        happinessBar.style.width = plantData.happiness + '%';
        
        const nextStageDays = currentStage < stages.length - 1 ? stages[currentStage + 1].days : stages[currentStage].days;
        const growthProgress = (plantData.daysWatered / nextStageDays) * 100;
        growthBar.style.width = Math.min(100, growthProgress) + '%';
        
        dayCountEl.textContent = plantData.daysWatered;
        
        if (plantData.daysWatered === stages[currentStage].days) {
          showMessage(stages[currentStage].message);
          
          if (plantData.type === 'flower' && currentStage === stages.length - 1) {
            unlockAchievement('flower');
          } else if (plantData.type === 'cactus' && currentStage === stages.length - 1) {
            unlockAchievement('cactus');
          } else if (plantData.type === 'fern' && currentStage === stages.length - 1) {
            unlockAchievement('fern');
          }
        }
        
        checkAchievements();
        
        if (plantData.needsUpdate) {
          localStorage.setItem('plantData', JSON.stringify(plantData));
          plantData.needsUpdate = false;
        }
      }
      
      function waterPlant() {
        const today = new Date().toDateString();
        const lastWateredDate = plantData.lastWatered ? new Date(plantData.lastWatered).toDateString() : null;
        
        if (lastWateredDate !== today) {
          for (let i = 0; i < 5; i++) {
            createWaterDrop();
          }
          
          plantData.lastWatered = new Date().toISOString();
          plantData.daysWatered++;
          plantData.consecutiveDays++;
          plantData.hydration = Math.min(100, plantData.hydration + 30);
          plantData.happiness = Math.min(100, plantData.happiness + 15);
          plantData.health = Math.min(100, plantData.health + 10);
          plantData.needsUpdate = true;
          
          localStorage.setItem('plantData', JSON.stringify(plantData));
          updatePlant();
          checkForSpecialEvents();
          showMessage("Nice! Your plant is happy with the water. Come back tomorrow!");
        } else {
          showMessage("You already watered your plant today. Come back tomorrow!");
        }
      }
      
      function createWaterDrop() {
        const drop = document.createElement('div');
        drop.className = 'water-drop';
        drop.style.left = (Math.random() * 200 + 50) + 'px';
        document.querySelector('.container').appendChild(drop);
        
        setTimeout(function() {
          drop.remove();
        }, 1000);
      }
      
      function showMessage(text) {
        messageEl.textContent = text;
        messageEl.style.animation = 'none';
        void messageEl.offsetWidth;
        messageEl.style.animation = 'fadeIn 1s';
      }
      
      function applySeasonalEffects() {
        const now = new Date();
        const month = now.getMonth();
        
        document.body.className = '';
        document.querySelectorAll('.snowflake, .leaf, .petal').forEach(function(el) {
          el.remove();
        });
        
        if (month >= 11 || month < 2) {
          document.body.classList.add('winter');
          createSnowflakes();
        } else if (month >= 2 && month < 5) {
          document.body.classList.add('spring');
          createPetals();
        } else if (month >= 5 && month < 8) {
          document.body.classList.add('summer');
        } else {
          document.body.classList.add('autumn');
          createLeaves();
        }
      }
      
      function createSnowflakes() {
        for (let i = 0; i < 15; i++) {
          setTimeout(function() {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.innerHTML = '❄';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.top = '-20px';
            flake.style.fontSize = (10 + Math.random() * 10) + 'px';
            flake.style.opacity = 0.7 + Math.random() * 0.3;
            document.body.appendChild(flake);
            
            animateSnowflake(flake);
          }, i * 300);
        }
      }
      
      function animateSnowflake(flake) {
        const duration = 5000 + Math.random() * 5000;
        const animation = flake.animate([
          { top: '-20px', left: flake.style.left },
          { top: '100vh', left: parseFloat(flake.style.left) + (Math.random() * 40 - 20) + 'px' }
        ], {
          duration: duration,
          iterations: Infinity
        });
      }
      
      function createLeaves() {
        for (let i = 0; i < 10; i++) {
          setTimeout(function() {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.innerHTML = '🍁';
            leaf.style.left = Math.random() * 100 + 'vw';
            leaf.style.top = '-20px';
            leaf.style.fontSize = (15 + Math.random() * 10) + 'px';
            document.body.appendChild(leaf);
            
            animateLeaf(leaf);
          }, i * 500);
        }
      }
      
      function animateLeaf(leaf) {
        const duration = 8000 + Math.random() * 5000;
        const animation = leaf.animate([
          { top: '-20px', left: leaf.style.left, transform: 'rotate(0deg)' },
          { top: '100vh', left: parseFloat(leaf.style.left) + (Math.random() * 100 - 50) + 'px', transform: 'rotate(360deg)' }
        ], {
          duration: duration,
          iterations: Infinity
        });
      }
      
      function createPetals() {
        for (let i = 0; i < 8; i++) {
          setTimeout(function() {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.innerHTML = '🌸';
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.top = '-20px';
            petal.style.fontSize = (10 + Math.random() * 10) + 'px';
            document.body.appendChild(petal);
            
            animatePetal(petal);
          }, i * 600);
        }
      }
      
      function animatePetal(petal) {
        const duration = 7000 + Math.random() * 5000;
        const animation = petal.animate([
          { top: '-20px', left: petal.style.left, transform: 'rotate(0deg)' },
          { top: '100vh', left: parseFloat(petal.style.left) + (Math.random() * 60 - 30) + 'px', transform: 'rotate(180deg)' }
        ], {
          duration: duration,
          iterations: Infinity
        });
      }
      
      function checkForSpecialEvents() {
        if (Math.random() < 0.15) {
          const events = [
            { message: "A butterfly visited your plant!", effect: "happiness+20" },
            { message: "Your plant grew extra leaves today!", effect: "daysWatered+0.5" },
            { message: "Oh no! Aphids attacked your plant!", effect: "health-10" },
            { message: "Sunshine gave your plant extra energy!", effect: "happiness+10,health+5" },
            { message: "Your plant is glowing with health!", effect: "health+15" }
          ];
          
          const event = events[Math.floor(Math.random() * events.length)];
          showMessage(event.message);
          applyEventEffect(event.effect);
        }
      }
      
      function applyEventEffect(effect) {
        effect.split(',').forEach(function(part) {
          const parts = part.split(/(\\+|-)/);
          const stat = parts[0];
          const op = parts[1];
          const value = parts[2];
          if (op === '+') {
            plantData[stat] = Math.min(100, plantData[stat] + parseInt(value));
          } else if (op === '-') {
            plantData[stat] = Math.max(0, plantData[stat] - parseInt(value));
          }
        });
        plantData.needsUpdate = true;
        updatePlant();
      }
      
      function checkAchievements() {
        if (plantData.daysWatered === 1 && !plantData.achievements.includes('first_water')) {
          unlockAchievement('first_water');
        }
        if (plantData.consecutiveDays === 3 && !plantData.achievements.includes('three_days')) {
          unlockAchievement('three_days');
        }
        if (plantData.consecutiveDays === 7 && !plantData.achievements.includes('week_streak')) {
          unlockAchievement('week_streak');
        }
      }
      
      function unlockAchievement(id) {
        const achievement = achievements.find(function(a) {
          return a.id === id;
        });
        if (achievement && !plantData.achievements.includes(id)) {
          plantData.achievements.push(id);
          plantData.needsUpdate = true;
          
          achievementText.textContent = achievement.name + ': ' + achievement.desc;
          achievementEl.style.display = 'block';
          
          setTimeout(function() {
            achievementEl.style.display = 'none';
          }, 3000);
        }
      }
      
      shareBtn.addEventListener('click', function() {
        const message = 'Check out my ' + plantData.type + ' plant on day ' + plantData.daysWatered + '! ' +
                       'Health: ' + plantData.health + '%, Hydration: ' + plantData.hydration + '%, ' +
                       'Happiness: ' + plantData.happiness + '%';
        
        if (navigator.share) {
          navigator.share({
            title: 'My Pet Plant',
            text: message
          }).catch(function(err) {
            showMessage("Sharing failed, but your plant still loves you!");
          });
        } else {
          prompt("Copy this to share your plant:", message);
          showMessage("Plant details copied!");
        }
      });
      
      waterBtn.addEventListener('click', waterPlant);
      
      if (!plantData.type) {
      } else if (!lastWateredDate) {
        showMessage("Welcome to your Pet Plant! Water it daily to help it grow.");
      } else if (lastWateredDate === today) {
        showMessage("You already watered your plant today. Come back tomorrow!");
      } else {
        showMessage("Your plant is waiting for water! Click the button to water it.");
      }
    });
  </script>
</body>
</html>
        `);
        doc.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-navy-900 rounded-lg p-4 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <iframe
          ref={iframeRef}
          className="w-full h-[600px] rounded-lg"
          title="Plant Game"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};
