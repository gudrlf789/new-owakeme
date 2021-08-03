export const CHANNEL_ENTER = 'CHANNEL_ENTER';

export const channelEnter = (channelName) => {
    return {
        type: CHANNEL_ENTER,
        channelName: channelName
    }
}