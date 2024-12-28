import { Show, For } from 'solid-js';

function HomePage(props) {
  const {
    documents,
    loading,
    uploading,
    handleFileChange,
    handleUpload,
    handleSignOut
  } = props;

  return (
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600">Document Archive</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-2xl font-bold mb-4 text-purple-600">Upload Document</h2>
        <input
          type="file"
          accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx"
          onChange={handleFileChange}
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border mb-4"
        />
        <button
          onClick={handleUpload}
          class={`bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${uploading() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading()}
        >
          {uploading() ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Documents</h2>
        <Show when={!loading()} fallback={<p>Loading documents...</p>}>
          <div class="space-y-4">
            <For each={documents()}>
              {(doc) => (
                <div class="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p class="font-semibold text-lg text-purple-600">{doc.filename}</p>
                    <p class="text-gray-500 text-sm">Uploaded on {new Date(doc.uploadDate).toLocaleString()}</p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                  >
                    Download
                  </a>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      <div class="mt-8 text-center">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}

export default HomePage;