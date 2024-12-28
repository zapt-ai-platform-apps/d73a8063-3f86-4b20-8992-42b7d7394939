import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = createSignal(null);
  const [documents, setDocuments] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [fileToUpload, setFileToUpload] = createSignal(null);
  const [uploading, setUploading] = createSignal(false);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const fetchDocuments = async () => {
    setLoading(true);
    console.log('Fetching documents...');
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/getDocuments', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        console.log('Documents fetched successfully');
      } else {
        console.error('Error fetching documents');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (user()) {
      fetchDocuments();
    }
  });

  const handleFileChange = (e) => {
    setFileToUpload(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!fileToUpload()) return;
    setUploading(true);
    console.log('Uploading file...');
    const { data: { session } } = await supabase.auth.getSession();
    const formData = new FormData();
    formData.append('file', fileToUpload());

    try {
      const response = await fetch('/api/uploadFile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData
      });
      if (response.ok) {
        setFileToUpload(null);
        console.log('File uploaded successfully');
        await fetchDocuments();
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div class="min-h-screen bg-gray-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={<AuthPage />}
      >
        <HomePage
          user={user}
          documents={documents}
          loading={loading}
          uploading={uploading}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          handleSignOut={handleSignOut}
        />
      </Show>
    </div>
  );
}

export default App;