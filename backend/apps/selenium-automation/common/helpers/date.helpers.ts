import { format, addWeeks, parse } from 'date-fns';

export const addNWeeks = (dateString: string, n: number): string => {
  const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());

  const nextWeeks = addWeeks(parsedDate, n);

  return format(nextWeeks, 'dd/MM/yyyy');
};
