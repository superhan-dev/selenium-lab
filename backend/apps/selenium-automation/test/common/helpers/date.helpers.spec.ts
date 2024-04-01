import { parse, format } from 'date-fns';

describe('date.helper test', () => {
  it('parse date test', () => {
    const dateString = '31/03/2024';

    const splitDates: string[] = dateString.split('/');

    const year: string = splitDates[2];
    const month: string = splitDates[1];
    const day: string = splitDates[0];

    const today: Date = new Date(`${year}-${month}-${day}`);

    const parsedDate: Date = parse(dateString, 'dd/MM/yyyy', new Date());

    expect(format(today, 'dd/MM/yyyy')).toBe(format(parsedDate, 'dd/MM/yyyy'));
  });
});
