import { DEPLOYMENT_URL } from './util/env.ts'

export default function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{
        background: '#1E1F24',
        padding: '0.5rem',
        display: 'flex',
        gap: '0.45rem',
        borderRadius: '12px',
        border: '1px solid #8D8D8D20',
      }}>
        {/* Badge */}
        <img src={`${DEPLOYMENT_URL}/api/cradle/badge?type=download&colorMode=dark`} alt='Download' />
        <img src={`${DEPLOYMENT_URL}/api/cradle/badge?type=sync&colorMode=dark`} alt='SyncLatest' />
        <img src={`${DEPLOYMENT_URL}/api/cradle/badge?type=tests&colorMode=dark`} alt='CiTests' />
      </div>

      <div style={{
        background: '#FFFFFF',
        padding: '0.5rem',
        display: 'flex',
        gap: '0.45rem',
        borderRadius: '12px',
        border: '1px solid #8D8D8D20',
      }}>
        {/* Badge */}
        <img src={`${DEPLOYMENT_URL}/api/cradle/badge?type=download&colorMode=light`} alt='Download' />
        <img src={`${DEPLOYMENT_URL}/api/cradle/badge?type=sync&colorMode=light`} alt='SyncLatest' />
        <img src={`${DEPLOYMENT_URL}/api/cradle/badge?type=tests&colorMode=light`} alt='CiTests' />
      </div>
    </div>
  )
}
