export const formatPlayersAmount = (playersAmount: number | string) => {
    if (typeof playersAmount === 'number') {
        return playersAmount.toString();
    }

    return playersAmount;
};
