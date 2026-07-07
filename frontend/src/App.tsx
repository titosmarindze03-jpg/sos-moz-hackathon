import { useState } from 'react';
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import DashboardView from './components/DashboardView';
import FamilyView from './components/FamilyView';
import RequestHelpView from './components/RequestHelpView';
import ReportIsolatedView from './components/ReportIsolatedView';
import FullMapView from './components/FullMapView';
import AdminView from './components/AdminView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [extraParams, setExtraParams] = useState<any>(null);

  const handleNavigate = (tab: string, params?: any) => {
    setActiveTab(tab);
    setExtraParams(params || null);
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSOSReport = () => {
    handleNavigate('report-isolated');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'family':
        return <FamilyView />;
      case 'request-help':
        return (
          <RequestHelpView
            initialCategory={extraParams?.selectedCategory}
            onNavigateHome={() => handleNavigate('dashboard')}
          />
        );
      case 'report-isolated':
        return <ReportIsolatedView onNavigateHome={() => handleNavigate('dashboard')} />;
      case 'map':
        return <FullMapView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="h-screen bg-[#F9F9FC] antialiased">
      {/* Fully responsive container that adapts to all screen sizes */}
      <div className="w-full h-full relative flex flex-col overflow-hidden bg-[#F9F9FC]">
        
        {/* Top App Bar */}
        <TopAppBar activeTab={activeTab} onNavigate={handleNavigate} onOpenSOSReport={handleOpenSOSReport} />
        
        {/* Main Content Area with centered boundaries for great responsiveness */}
        <main className="flex-1 w-full overflow-y-auto scroll-smooth bg-[#F9F9FC] pt-20 pb-24">
          <div className="max-w-5xl mx-auto w-full px-4">
            {renderActiveView()}
          </div>
        </main>
        
        {/* Bottom Tab Bar */}
        <BottomNavBar activeTab={activeTab} onTabChange={handleNavigate} />
        
      </div>
    </div>
  );
}
