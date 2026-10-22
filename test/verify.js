const Engine = require('../js/fifo-lifo-engine.js');
const Data = require('../js/fifo-lifo-data.js');

console.log('Testing Scenarios on Engine...');
Data.SCENARIOS.forEach((sc, i) => {
  const comp = Engine.compareAllFourMethods(sc.transactions, { taxRate: sc.taxRate, operatingExpenses: sc.operatingExpenses });
  console.log(`Scenario ${i+1}: ${sc.name} -> Price trend: ${comp.priceTrend}`);
  console.log(`  FIFO COGS: ${comp.results.fifoPeriodic.cogs}, Ending: ${comp.results.fifoPeriodic.endingInventoryCost}`);
  console.log(`  AVCO Periodic COGS: ${comp.results.avcoPeriodic.cogs}, Ending: ${comp.results.avcoPeriodic.endingInventoryCost}`);
  console.log(`  AVCO Perpetual COGS: ${comp.results.avcoPerpetual.cogs}, Ending: ${comp.results.avcoPerpetual.endingInventoryCost}`);
  
  if (isNaN(comp.results.fifoPeriodic.cogs) || isNaN(comp.results.avcoPeriodic.cogs) || isNaN(comp.results.avcoPerpetual.cogs)) {
    throw new Error('NaN detected in scenario ' + sc.name);
  }

  // Check identity COGAS = COGS + Ending Inventory
  const fifoTotal = Engine.round2(comp.results.fifoPeriodic.cogs + comp.results.fifoPeriodic.endingInventoryCost);
  const avcoPerTotal = Engine.round2(comp.results.avcoPeriodic.cogs + comp.results.avcoPeriodic.endingInventoryCost);
  const avcoPerpTotal = Engine.round2(comp.results.avcoPerpetual.cogs + comp.results.avcoPerpetual.endingInventoryCost);
  
  if (Math.abs(fifoTotal - comp.cogas.totalCost) > 0.05) {
    throw new Error(`FIFO Identity failed: ${fifoTotal} vs ${comp.cogas.totalCost}`);
  }
  if (Math.abs(avcoPerTotal - comp.cogas.totalCost) > 0.05) {
    throw new Error(`AVCO Periodic Identity failed: ${avcoPerTotal} vs ${comp.cogas.totalCost}`);
  }
  if (Math.abs(avcoPerpTotal - comp.cogas.totalCost) > 0.05) {
    throw new Error(`AVCO Perpetual Identity failed: ${avcoPerpTotal} vs ${comp.cogas.totalCost}`);
  }
});

console.log('Testing Dispatch Missions...');
Data.DISPATCH_MISSIONS.forEach((m, i) => {
  const sumPicked = m.correctSelection.reduce((a, b) => a + b.units, 0);
  if (sumPicked !== m.orderUnits) {
    throw new Error(`Mission ${i+1} unit mismatch: picked ${sumPicked}, needed ${m.orderUnits}`);
  }
  const calcCogs = m.correctSelection.reduce((a, b) => a + (b.units * b.unitCost), 0);
  if (Math.abs(calcCogs - m.correctCogs) > 0.01) {
    throw new Error(`Mission ${i+1} COGS mismatch: expected ${m.correctCogs}, calculated ${calcCogs}`);
  }
});

console.log('Testing Exam Questions...');
Data.EXAM_QUESTIONS.forEach((q, i) => {
  if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
    throw new Error(`Question ${i+1} invalid correctIndex`);
  }
  console.log(`  Q${i+1} (${q.targetMethod}): [${q.scenarioTitle}] OK`);
});

console.log('\n>>> All FIFO & AVCO Data and Engine verifications PASSED perfectly! <<<');
