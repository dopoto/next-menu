'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import { getErrorContext, isContextError } from '~/app/_domain/errors';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error, 'isContextError:', isContextError(error));
  }, [error]);

  // Get context and ensure we handle both raw and serialized errors
  const errorContext = getErrorContext(error);
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong!</h2>
      <p className="text-red-600 mb-4">{errorMessage}</p>
      
      {errorContext && (
        <div className="mb-4">
          <h3 className="font-semibold text-red-600">Error Context:</h3>
          <pre className="bg-red-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(errorContext, null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}