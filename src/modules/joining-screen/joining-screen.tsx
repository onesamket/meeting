'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { JoinScreenProps } from '.';
import { useState, type FC } from 'react';
import { 
  Video, 
  Users, 
  Plus, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';

export const JoinScreen: FC<JoinScreenProps> = ({
  getMeetingAndToken,
  setMode,
  username,
  setUsername
}) => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleJoin = async () => {
    setIsCreating(true);
    try {
      await getMeetingAndToken(meetingId);
    } catch (error) {
      console.error('Failed to join meeting:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isJoinMode = meetingId && meetingId.trim() !== '';
  const isCreateMode = !meetingId || meetingId.trim() === '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="relative w-full max-w-md p-8 shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Video className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Video Meeting
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Connect with your team instantly
          </p>
        </div>

        {/* Mode indicators */}
        <div className="flex gap-2 mb-6">
          <Badge 
            variant={isCreateMode ? "default" : "secondary"} 
            className={`flex-1 justify-center py-2 transition-all duration-300 ${
              isCreateMode ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : ''
            }`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Badge>
          <Badge 
            variant={isJoinMode ? "default" : "secondary"} 
            className={`flex-1 justify-center py-2 transition-all duration-300 ${
              isJoinMode ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : ''
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

          {/* Advanced options toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Advanced Options
              <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} />
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Meeting Mode
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMode('SEND_AND_RECV')}
                      className="flex-1 text-xs"
                    >
                      Full Access
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMode('SIGNALLING_ONLY')}
                      className="flex-1 text-xs"
                    >
                      View Only
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Action button */}
          <Button
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
              isCreating 
                ? 'bg-slate-400 dark:bg-slate-600' 
                : isJoinMode
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
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
    </div>
  );
};
