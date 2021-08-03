import AgoraRTM from 'agora-rtm-sdk'
import EventEmitter from 'events'

export default class RTMClient extends EventEmitter {
  constructor () {
    super()
    this.channels = {}
    this._logined = false
  }

  init (appId) {
    this.client = AgoraRTM.createInstance(appId)
    this.subscribeClientEvents()
  }

  // subscribe client events
  subscribeClientEvents () {
    const clientEvents = [
      'ConnectionStateChanged',
      'MessageFromPeer'
    ]
    clientEvents.forEach((eventName) => {
      this.client.on(eventName, (...args) => {
        console.log('emit ', eventName, ...args)
        // log event message
        this.emit(eventName, ...args)
      })
    })
  }

  // subscribe channel events
  subscribeChannelEvents (channelName) {
    const channelEvents = [
      'ChannelMessage',
      'MemberJoined',
      'MemberLeft'
    ]
    channelEvents.forEach((eventName) => {
      this.channels[channelName].channel.on(eventName, (...args) => {
        console.log('emit ', eventName, args)
        this.emit(eventName, { channelName, args: args })
      })
    })
  }

  async login (uid, token, channelName) {
    this.accountName = uid
    //return await this.client.login({ uid: this.accountName, token})
    await this.client.login({ uid: this.accountName, token}).then(() => {
      this._logined = true;
      this.joinChannel(channelName).then(() => {
        this.channels[channelName].joined = true;
      })
    })
  }

  async logout () {
    return this.client.logout()
  }

  async joinChannel (channelName) {
    console.log('joinChannel', channelName)
    const channel = this.client.createChannel(channelName)
    this.channels[channelName] = {
      channel,
      joined: false // channel state
    }
    this.subscribeChannelEvents(channelName)
    return await channel.join()
  }

  async leaveChannel (channelName) {
    console.log('leaveChannel', channelName)
    if (!this.channels[channelName] ||
      (this.channels[channelName] &&
        !this.channels[channelName].joined)) return
    return this.channels[channelName].channel.leave()
  }

  async sendChannelMessage (text, channelName) {
    if (!this.channels[channelName] || !this.channels[channelName].joined) return
    return this.channels[channelName].channel.sendMessage({ text })
  }

  async sendPeerMessage (text, peerId) {
    console.log('sendPeerMessage', text, peerId)
    return this.client.sendMessageToPeer({ text }, peerId.toString())
  }

  async queryPeersOnlineStatus (memberId) {
    console.log('queryPeersOnlineStatus', memberId)
    return this.client.queryPeersOnlineStatus([memberId])
  }

  //send image
  async uploadImage (blob, peerId) {
    const mediaMessage = await this.client.createMediaMessageByUploading(blob, {
      messageType: 'IMAGE',
      fileName: 'agora.jpg',
      description: 'send image',
      thumbnail: blob, 
      // width: 100,
      // height: 200,
      // thumbnailWidth: 50,
      // thumbnailHeight: 200, 
    }) 
    return this.client.sendMessageToPeer(mediaMessage, peerId)
  }

  async sendChannelMediaMessage (blob, channelName, files) {
    console.log('sendChannelMessage', blob, channelName)
    if (!this.channels[channelName] || !this.channels[channelName].joined) return
    const mediaMessage = await this.client.createMediaMessageByUploading(blob, {
      messageType: "IMAGE",
      fileName: files.name,
      description: 'send image',
      thumbnail: blob, 
      // width: 100,
      // height: 200,
      // thumbnailWidth: 50,
      // thumbnailHeight: 200, 
    })
    return this.channels[channelName].channel.sendMessage(mediaMessage)
  }

  async cancelImage (message) {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 1000)
    await this.client.downloadMedia(message.mediaId, {
      cancelSignal: controller.signal,
      onOperationProgress: ({currentSize, totalSize}) => {
        console.log(currentSize, totalSize)
      },
    })
  }

  async downloadChannelMedia(mediaId){
    debugger;
    const blob = await this.client.downloadMedia(mediaId)
    return blob;
  }

}