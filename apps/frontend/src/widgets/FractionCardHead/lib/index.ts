export const formatFractionHours = (hoursAmount: number | string) => {
    if (typeof hoursAmount !== 'number') {
        return hoursAmount;
    }

    const [wholePart, fractionPart = ''] = hoursAmount.toString().split('.');
    const groupedWholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const trimmedFractionPart = fractionPart.replace(/0+$/, '');

    if (!trimmedFractionPart) {
        return groupedWholePart;
    }

    return `${groupedWholePart}.${trimmedFractionPart}`;
};

export const formatPlayersAmount = (playersAmount: number | string) => {
    if (typeof playersAmount === 'number') {
        return playersAmount.toString();
    }

    return playersAmount;
};
