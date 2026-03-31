import { SettingsMenu } from './components/SettingsMenu';

export default function App() {
  return (
    <div className="size-full flex items-center justify-center">
      <SettingsMenu onBack={() => console.log('Back clicked')} />
    </div>
  );
}