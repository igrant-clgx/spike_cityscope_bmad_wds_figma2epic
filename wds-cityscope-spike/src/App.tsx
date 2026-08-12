import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/source-sans-pro/400.css';
import theme from './theme';
import { EstimateFlowProvider } from './context/EstimateFlowContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AddressEntryPage from './pages/AddressEntryPage';
import QuestionnairePage from './pages/QuestionnairePage';
import EstimateReportPage from './pages/EstimateReportPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EstimateFlowProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<AddressEntryPage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/estimate" element={<EstimateReportPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </EstimateFlowProvider>
    </ThemeProvider>
  );
}

export default App;
