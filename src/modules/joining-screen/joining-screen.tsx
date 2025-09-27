'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import {
  ArrowRight,
  Camera,
  Check,
  EyeOff,
  Loader2,
  Mic,
  Play,
  Plus,
  Settings,
  Share2,
  Shield,
  Sparkles,
  Square,
  Users,
  Video,
  Volume2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useEffect, useRef, useState, type FC } from 'react';
import type { JoinScreenProps } from '.';

interface MediaDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export const JoinScreen: FC<JoinScreenProps> = ({
  getMeetingAndToken,
  setMode,
  username,
  setUsername,
  deviceConfig,
  setDeviceConfig,
  meetingId: propMeetingId,
  onShareLink
}) => {
  const [meetingId, setMeetingId] = useState<string | null>(propMeetingId || null);
  const [isCreating, setIsCreating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Default device configuration
  const defaultDeviceConfig = {
    camera: { deviceId: '', enabled: true },
    microphone: { deviceId: '', enabled: true },
    speaker: { deviceId: '' }
  };

  const currentDeviceConfig = deviceConfig || defaultDeviceConfig;

  // Get available media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const deviceList = mediaDevices
          .filter(device => device.kind === 'videoinput' || device.kind === 'audioinput' || device.kind === 'audiooutput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `${device.kind} ${device.deviceId.slice(0, 8)}`,
            kind: device.kind
          }));
        setDevices(deviceList);

        // Set default devices if not configured
        if (!deviceConfig) {
          const defaultCamera = deviceList.find(d => d.kind === 'videoinput');
          const defaultMic = deviceList.find(d => d.kind === 'audioinput');
          const defaultSpeaker = deviceList.find(d => d.kind === 'audiooutput');
          
          if (setDeviceConfig) {
            setDeviceConfig({
              camera: { deviceId: defaultCamera?.deviceId || '', enabled: true },
              microphone: { deviceId: defaultMic?.deviceId || '', enabled: true },
              speaker: { deviceId: defaultSpeaker?.deviceId || '' }
            });
          }
        }
      } catch (error) {
        console.error('Error getting devices:', error);
        toast({
          title: "Device Access Error",
          description: "Unable to access media devices. Please check permissions.",
          variant: "destructive"
        });
      }
    };

    getDevices();
  }, [deviceConfig, setDeviceConfig, toast]);

  // Start camera preview (always on)
  useEffect(() => {
    const startPreview = async () => {
      if (currentDeviceConfig.camera.enabled && currentDeviceConfig.camera.deviceId) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: currentDeviceConfig.camera.deviceId },
            audio: false
          });
          setLocalStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error starting camera preview:', error);
          toast({
            title: "Camera Error",
            description: "Unable to access camera. Please check permissions.",
            variant: "destructive"
          });
        }
      }
    };

    startPreview();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
    };
  }, [currentDeviceConfig.camera, toast]);

  // Audio testing functionality
  const startAudioTest = async () => {
    if (isTestingAudio) return;
    
    try {
      setIsTestingAudio(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: currentDeviceConfig.microphone.deviceId ? { deviceId: currentDeviceConfig.microphone.deviceId } : true
      });
      setAudioStream(stream);

      // Set up audio context for level detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start monitoring audio levels
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const monitorAudio = () => {
        if (analyserRef.current && isTestingAudio) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          animationFrameRef.current = requestAnimationFrame(monitorAudio);
        }
      };
      
      monitorAudio();

      toast({
        title: "Audio Test Started",
        description: "Speak into your microphone to test audio levels.",
      });
    } catch (error) {
      console.error('Error testing audio:', error);
      toast({
        title: "Audio Test Failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
      setIsTestingAudio(false);
    }
  };

  const stopAudioTest = () => {
    setIsTestingAudio(false);
    setAudioLevel(0);
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    analyserRef.current = null;
  };

  // Cleanup audio test on unmount
  useEffect(() => {
    return () => {
      stopAudioTest();
    };
  }, []);

  const handleJoin = async () => {
    // Stop audio test before joining
    stopAudioTest();
    
    setIsCreating(true);
    try {
      await getMeetingAndToken(meetingId);
    } catch (error) {
      console.error('Failed to join meeting:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to join the meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleShareLink = () => {
    if (meetingId) {
      const shareUrl = `${window.location.origin}?meetingId=${meetingId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        setIsLinkCopied(true);
        toast({
          title: "Link Copied",
          description: "Meeting link has been copied to clipboard.",
        });
        setTimeout(() => setIsLinkCopied(false), 2000);
        onShareLink?.(meetingId);
      });
    }
  };

  const updateDeviceConfig = (key: keyof typeof currentDeviceConfig, value: any) => {
    if (setDeviceConfig) {
      setDeviceConfig({
        ...currentDeviceConfig,
        [key]: value
      });
    }
  };

  const isJoinMode = meetingId && meetingId.trim() !== '';
  const isCreateMode = !meetingId || meetingId.trim() === '';

  const cameraDevices = devices.filter(d => d.kind === 'videoinput');
  const microphoneDevices = devices.filter(d => d.kind === 'audioinput');
  const speakerDevices = devices.filter(d => d.kind === 'audiooutput');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Join Card */}
        <Card className="relative p-8 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Video Meeting
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Connect with your team instantly
            </p>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
            {connectionStatus === 'connected' ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          </div>

          {/* Mode indicators */}
          <div className="flex gap-2 mb-6">
            <Badge 
              variant={isCreateMode ? "default" : "secondary"} 
              className={`flex-1 justify-center py-2 transition-all duration-300 ${
                isCreateMode ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : ''
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Badge>
            <Badge 
              variant={isJoinMode ? "default" : "secondary"} 
              className={`flex-1 justify-center py-2 transition-all duration-300 ${
                isJoinMode ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : ''
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              Join Existing
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Username field */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your Name
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter your display name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                  disabled={isCreating}
                />
                {username && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Meeting ID field */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Meeting ID
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  (Optional - leave empty to create new)
                </span>
              </Label>
              <div className="relative">
                <Input
                  placeholder="Enter meeting ID to join existing room"
                  value={meetingId || ''}
                  onChange={(e) => setMeetingId(e.target.value || null)}
                  className="pl-4 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 rounded-xl bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                  disabled={isCreating}
                />
                {meetingId && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Share Link Button */}
            {meetingId && (
              <Button
                variant="outline"
                onClick={handleShareLink}
                className="w-full py-3 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {isLinkCopied ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      <span>Share Meeting Link</span>
                    </>
                  )}
                </div>
              </Button>
            )}


            <Separator className="my-6" />

            {/* Action button */}
            <Button
              className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isCreating 
                  ? 'bg-slate-400 dark:bg-slate-600' 
                  : isJoinMode
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
              onClick={handleJoin}
              disabled={isCreating || !username}
            >
              {isCreating ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {isJoinMode ? (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Join Meeting</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Meeting</span>
                    </>
                  )}
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>

            {/* Status indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>HD Quality</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Real-time</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Device Configuration Panel - Always Visible */}
        <Card className="relative p-6 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Device Configuration
              </h2>
            </div>

            {/* Camera Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Camera Preview
              </Label>
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                {currentDeviceConfig.camera.enabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <EyeOff className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Camera disabled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera
                </Label>
                <Switch
                  checked={currentDeviceConfig.camera.enabled}
                  onCheckedChange={(enabled) => 
                    updateDeviceConfig('camera', { ...currentDeviceConfig.camera, enabled })
                  }
                />
              </div>
              {currentDeviceConfig.camera.enabled && (
                <Select
                  value={currentDeviceConfig.camera.deviceId}
                  onValueChange={(deviceId) => 
                    updateDeviceConfig('camera', { ...currentDeviceConfig.camera, deviceId })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {cameraDevices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Microphone Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Microphone
                </Label>
                <Switch
                  checked={currentDeviceConfig.microphone.enabled}
                  onCheckedChange={(enabled) => 
                    updateDeviceConfig('microphone', { ...currentDeviceConfig.microphone, enabled })
                  }
                />
              </div>
              {currentDeviceConfig.microphone.enabled && (
                <Select
                  value={currentDeviceConfig.microphone.deviceId}
                  onValueChange={(deviceId) => 
                    updateDeviceConfig('microphone', { ...currentDeviceConfig.microphone, deviceId })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {microphoneDevices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Audio Testing */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Audio Testing
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isTestingAudio ? stopAudioTest : startAudioTest}
                  disabled={!currentDeviceConfig.microphone.enabled}
                  className="flex-1"
                >
                  {isTestingAudio ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Test
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Test Audio
                    </>
                  )}
                </Button>
                {isTestingAudio && (
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-red-500 transition-all duration-100"
                          style={{ width: `${Math.min(audioLevel * 2, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 min-w-[2rem]">
                        {Math.round(audioLevel)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Speaker Settings */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Speaker
              </Label>
              <Select
                value={currentDeviceConfig.speaker.deviceId}
                onValueChange={(deviceId) => 
                  updateDeviceConfig('speaker', { deviceId })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select speaker" />
                </SelectTrigger>
                <SelectContent>
                  {speakerDevices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Device Status */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Camera</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentDeviceConfig.camera.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={currentDeviceConfig.camera.enabled ? 'text-green-600' : 'text-red-600'}>
                      {currentDeviceConfig.camera.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Microphone</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentDeviceConfig.microphone.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className={currentDeviceConfig.microphone.enabled ? 'text-green-600' : 'text-red-600'}>
                      {currentDeviceConfig.microphone.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
                {isTestingAudio && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Audio Test</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-blue-600">Testing</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
