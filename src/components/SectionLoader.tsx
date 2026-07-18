import { useLocale } from "../i18n/LocaleContext";

const SectionLoader = () => {
  const { t } = useLocale();

  return (
    <div className="flex justify-center items-center min-h-[200px]" role="status" aria-label={t.system.loadingSection}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-16 h-16 border-4 border-accent-400/30 border-t-accent-400 rounded-full animate-spin"></div>
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-accent-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <span className="sr-only">{t.system.loadingContent}</span>
    </div>
  );
};

export default SectionLoader;
