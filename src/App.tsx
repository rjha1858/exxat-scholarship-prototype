import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/shell/AppShell'
import { HomePage } from './pages/HomePage'
import { ScholarshipsPage } from './pages/ScholarshipsPage'
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage'
import { ApplicationPage } from './pages/ApplicationPage'
import { ApplicationReviewPage } from './pages/ApplicationReviewPage'
import { ApplicationSuccessPage } from './pages/ApplicationSuccessPage'
import { JobsPage } from './pages/JobsPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/scholarships/:scholarshipId" element={<ScholarshipDetailPage />} />
          <Route path="/scholarships/:scholarshipId/apply" element={<ApplicationPage />} />
          <Route path="/scholarships/:scholarshipId/application/review" element={<ApplicationReviewPage />} />
          <Route path="/scholarships/:scholarshipId/application/success" element={<ApplicationSuccessPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
