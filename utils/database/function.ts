
const getColorByIndex = (index: number) => {
  const colors = [
    '#1E88E5',
    '#FFC107',
    '#E53935',
    '#43A047',
    '#8E24AA',
    '#00ACC1',
    '#FB8C00',
    '#5E35B1',
    '#546E7A',
    '#D81B60',
    '#00897B',
    '#C0CA33',
    '#6D4C41',
    '#7B1FA2',
    '#0288D1',
    '#F4511E',
    '#455A64',
    '#039BE5',
    '#8D6E63',
    '#616161',
    '#EF6C00',
    '#1565C0',
    '#B71C1C',
    '#827717',
    '#1B5E20',
    '#6A1B9A',
    '#01579B',
    '#4527A0',
    '#FF6F00',
    '#AD1457'
  ];

  return colors[index % colors.length];
};

export { getColorByIndex };
