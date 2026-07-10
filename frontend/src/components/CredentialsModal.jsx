import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineClipboardDocument, HiOutlineCheckCircle, HiOutlineKey } from "react-icons/hi2";
import Modal from "./Modal";

// Shown right after a Student/Teacher/Parent account is created, so the admin
// can copy the login email + generated password and share it with them.
const CredentialsModal = ({ open, onClose, credentials, personLabel = "this person" }) => {
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    const text = `School ERP Login\nEmail: ${credentials?.email}\nPassword: ${credentials?.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Credentials copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Account created">
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
          <HiOutlineKey className="h-5 w-5 shrink-0" />
          <p className="text-sm">Share these login details with {personLabel}. The password won't be shown again.</p>
        </div>

        <div className="space-y-2">
          <div>
            <p className="label-eyebrow mb-1">Email</p>
            <div className="rounded-xl border border-ink-700/10 dark:border-white/10 bg-ink-700/5 dark:bg-white/5 px-4 py-2.5 font-mono text-sm">
              {credentials?.email}
            </div>
          </div>
          <div>
            <p className="label-eyebrow mb-1">Password</p>
            <div className="rounded-xl border border-ink-700/10 dark:border-white/10 bg-ink-700/5 dark:bg-white/5 px-4 py-2.5 font-mono text-sm">
              {credentials?.password}
            </div>
          </div>
        </div>

        <button onClick={copyAll} className="btn-primary w-full">
          {copied ? <HiOutlineCheckCircle className="h-4 w-4" /> : <HiOutlineClipboardDocument className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy credentials"}
        </button>
      </div>
    </Modal>
  );
};

export default CredentialsModal;
