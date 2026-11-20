import React, { useEffect, useState } from 'react';
import { Check, Volume2, VolumeX, X } from 'lucide-react';
import {
  getLovelySystemVoices,
  getSelectedSystemVoiceURI,
  getSelectedVoicePreset,
  setSelectedSystemVoiceURI,
  setSelectedVoicePreset,
  speakText,
  stopSpeaking,
  subscribeVoicesLoaded,
  VOICE_PRESETS,
  VoicePresetId,
} from '../utils/speech';

interface VoicePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoicePickerModal: React.FC<VoicePickerModalProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<VoicePresetId>(() =>
    getSelectedVoicePreset()
  );
  const [systemVoiceURI, setSystemVoiceURI] = useState<string>(() =>
    getSelectedSystemVoiceURI()
  );
  const [deviceVoices, setDeviceVoices] = useState<SpeechSynthesisVoice[]>(() =>
    getLovelySystemVoices()
  );

  useEffect(() => {
    if (isOpen) {
      setSelectedPreset(getSelectedVoicePreset());
      setSystemVoiceURI(getSelectedSystemVoiceURI());
    }
    setDeviceVoices(getLovelySystemVoices());
    return subscribeVoicesLoaded(() => {
      setDeviceVoices(getLovelySystemVoices());
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (id: VoicePresetId) => {
    setSelectedPreset(id);
    setSelectedVoicePreset(id);
    const chosen = VOICE_PRESETS.find((v) => v.id === id);
    if (chosen) {
      speakText(chosen.sampleLine, undefined, id);
    }
  };

  const handleSelectDeviceVoice = (uri: string) => {
    setSystemVoiceURI(uri);
    setSelectedSystemVoiceURI(uri);
    const chosen = VOICE_PRESETS.find((v) => v.id === selectedPreset);
    speakText(
      chosen?.sampleLine || 'Hello explorer! Ready for a wonderful story today?',
      undefined,
      selectedPreset
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-picker-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        data-light-card="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              Child-Friendly Storyteller Voices
            </p>
            <h2
              id="voice-picker-title"
              className="font-heading font-extrabold text-xl text-slate-900 mt-0.5"
            >
              Choose a Lovely Voice
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Tap any character below to preview their storyteller or playful kid voice for stories, phonics, and quizzes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            aria-label="Close voice picker"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VOICE_PRESETS.map((voice) => {
            const active = selectedPreset === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => handleSelectPreset(voice.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                  active
                    ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-200'
                    : voice.isKidVoice
                    ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50/70 hover:border-amber-300'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-heading font-extrabold text-sm text-slate-900">
                      {voice.label}
                    </p>
                    {voice.isKidVoice && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-200/80 text-amber-950 text-[10px] font-extrabold tracking-tight">
                        Kid Voice
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-sky-800">{voice.subtitle}</p>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    &ldquo;{voice.sampleLine}&rdquo;
                  </p>
                </div>
                {active && (
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Optional Live Device / OS Voice Selector */}
        {deviceVoices.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <label
              htmlFor="device-voice-select"
              className="block text-xs font-extrabold text-slate-800"
            >
              Device Natural Voice ({deviceVoices.length} available on this device)
            </label>
            <select
              id="device-voice-select"
              value={systemVoiceURI}
              onChange={(e) => handleSelectDeviceVoice(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900"
            >
              <option value="auto">Auto-pick best natural UK voice (Recommended)</option>
              {deviceVoices.map((dv) => (
                <option key={dv.voiceURI} value={dv.voiceURI}>
                  {dv.name} ({dv.lang})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={stopSpeaking}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <VolumeX className="w-3.5 h-3.5" />
            Stop Voice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-[#001E62] hover:bg-[#0B2D7A] text-white text-xs font-extrabold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
