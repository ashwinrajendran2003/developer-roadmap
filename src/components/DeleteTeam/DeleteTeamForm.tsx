import { useEffect, useState } from 'preact/hooks';
import { httpDelete } from '../../lib/http';
import { useParams } from '../../hooks/use-params';
import type { TeamDocument } from '../CreateTeam/CreateTeamForm';

export function DeleteTeamForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const { teamId } = useParams<{ teamId: string }>();

  useEffect(() => {
    setError('');
    setConfirmationText('');
  }, []);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (confirmationText.toUpperCase() !== 'DELETE') {
      setError('Verification text does not match');
      setIsLoading(false);
      return;
    }

    const { response, error } = await httpDelete<TeamDocument>(
      `${import.meta.env.PUBLIC_API_URL}/v1-delete-team/${teamId}`
    );

    if (error || !response) {
      setIsLoading(false);
      setError(error?.message || 'Something went wrong');
      return;
    }

    window.location.href = '/';
  };

  const handleClosePopup = () => {
    setIsLoading(false);
    setError('');
    setConfirmationText('');

    const deleteAccountPopup = document.getElementById('delete-team-popup');
    deleteAccountPopup?.classList.add('hidden');
    deleteAccountPopup?.classList.remove('flex');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-4">
        <input
          type="text"
          name="delete-account"
          id="delete-account"
          className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none placeholder:text-gray-400 focus:border-gray-400"
          placeholder={'Type "delete" to confirm'}
          required
          autoFocus
          value={confirmationText}
          onInput={(e) =>
            setConfirmationText((e.target as HTMLInputElement).value)
          }
        />
        {error && (
          <p className="mt-2 rounded-lg bg-red-100 p-2 text-red-700">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleClosePopup}
          className="flex-grow cursor-pointer rounded-lg bg-gray-200 py-2 text-center"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || confirmationText.toUpperCase() !== 'DELETE'}
          className="flex-grow cursor-pointer rounded-lg bg-red-500 py-2 text-white disabled:opacity-40"
        >
          {isLoading ? 'Please wait ..' : 'Confirm'}
        </button>
      </div>
    </form>
  );
}
