import { ExportTest } from '@/components/test/ExportTest'

export default function TestExportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mini-Server Test Lab 🧪
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test the pre-warming strategy and serverless function performance. 
            Check the browser console to see timing details and cold start behavior.
          </p>
        </div>
        
        <ExportTest />
        
        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">🔍 What to Look For:</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-2">✅ Success Indicators:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• First warm-up takes 2-3 seconds</li>
                <li>• Subsequent calls are sub-second</li>
                <li>• CSV downloads correctly</li>
                <li>• Console shows timing measurements</li>
                <li>• No CORS errors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">❌ Issues to Watch:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Warm-up takes over 5 seconds</li>
                <li>• CORS errors in console</li>
                <li>• Failed to download CSV</li>
                <li>• Functions timeout</li>
                <li>• Email export doesn't respond</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}