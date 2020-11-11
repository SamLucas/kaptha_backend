import RuleInterface from '@/interfaces/Rules'

export const calc_peso_polifenol = (rule: RuleInterface) => {
  let pesoTotal = 0;
  if (rule.R2.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R3.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R4.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R5.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R6.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R8.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R9.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R10.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R14.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R15.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R16.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.is_title.indexOf("sim") >= 0) pesoTotal += 7;
  return pesoTotal;
};

export const calc_peso_gene = (rule: RuleInterface) => {
  let pesoTotal = 0;
  if (rule.R2.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R3.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R4.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R5.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R6.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R8.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R9.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R10.indexOf("sim") >= 0) pesoTotal += 1;
  return pesoTotal;
};

export const calc_peso_polifenol_cancer = (rule: RuleInterface) => {
  let pesoTotal = 0;
  if (rule.R1.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R2.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R3.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R4.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R5.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R6.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R7.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R8.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R9.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R10.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.R14.indexOf("sim") >= 0) pesoTotal += 3;
  if (rule.R16.indexOf("sim") >= 0) pesoTotal += 2;
  if (rule.is_title.indexOf("sim") >= 0) pesoTotal += 10;
  return pesoTotal;
};

export const calc_peso_polifenol_gene = (rule: RuleInterface) => {
  let pesoTotal = 0;
  if (rule.R11.indexOf("sim") >= 0) pesoTotal += 1;
  if (rule.R12.indexOf("sim") >= 0) pesoTotal += 2;
  return pesoTotal;
};