import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineUserGroup, HiOutlineTrash, HiOutlinePencilSquare } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import CredentialsModal from "../../components/CredentialsModal";
import EmptyState from "../../components/EmptyState";

const ParentList = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const { register, handleSubmit, reset, control, setValue } = useForm({
    defaultValues: { children: [] },
  });

  const load = async () => {
    setLoading(true);
    const [p, s] = await Promise.all([api.get("/parents"), api.get("/students", { params: { limit: 500 } })]);
    setParents(p.data.data.parents);
    setStudents(s.data.data.students);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", email: "", phone: "", occupation: "", relation: "father", children: [] });
    setModalOpen(true);
  };

  const openEdit = (parent) => {
    setEditing(parent);
    reset({
      occupation: parent.occupation || "",
      relation: parent.relation || "father",
      children: parent.children?.map((c) => c._id) || [],
    });
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    try {
      if (editing) {
        await api.put(`/parents/${editing._id}`, values);
        toast.success("Parent updated successfully");
      } else {
        const res = await api.post("/parents", values);
        toast.success("Parent added successfully");
        setCredentials(res.data.data.credentials);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save parent");
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this parent?")) return;
    await api.delete(`/parents/${id}`);
    toast.success("Parent removed");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600/60 dark:text-mist-200/50">{parents.length} parent accounts</p>
        <button onClick={openCreate} className="btn-primary">
          <HiOutlinePlus className="h-4 w-4" /> Add parent
        </button>
      </div>

      {loading ? (
        <Loader label="Loading parents" />
      ) : parents.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {parents.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 font-display font-semibold text-white">
                    {p.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{p.user?.name}</p>
                    <p className="text-xs text-ink-600/50 dark:text-mist-200/40 capitalize">{p.relation}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-violet-500 hover:bg-violet-500/10">
                    <HiOutlinePencilSquare className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(p._id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10">
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 truncate text-xs text-ink-600/50 dark:text-mist-200/40">{p.user?.email}</p>
              <div className="mt-3">
                <p className="label-eyebrow mb-1.5">Children</p>
                {p.children?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {p.children.map((c) => (
                      <span key={c._id} className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                        {c.user?.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-600/40 dark:text-mist-200/30">No children linked yet</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card">
          <EmptyState icon={HiOutlineUserGroup} title="No parents yet" message="Add a parent account and link it to one or more students." />
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit parent" : "Add parent"} wide>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          {!editing && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Full name</label>
                <input {...register("name", { required: !editing })} className="input-field" placeholder="Parent name" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Email</label>
                <input {...register("email", { required: !editing })} type="email" className="input-field" placeholder="parent@school.edu" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Phone</label>
                <input {...register("phone")} className="input-field" placeholder="9876543210" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Password (optional)</label>
                <input {...register("password")} type="text" className="input-field" placeholder="Leave blank to auto-generate" />
              </div>
            </>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Relation</label>
            <select {...register("relation")} className="input-field">
              <option value="father">Father</option>
              <option value="mother">Mother</option>
              <option value="guardian">Guardian</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Occupation</label>
            <input {...register("occupation")} className="input-field" placeholder="Occupation" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Link children</label>
            <Controller
              control={control}
              name="children"
              render={({ field }) => (
                <div className="max-h-40 space-y-1.5 overflow-y-auto rounded-xl border border-ink-700/10 dark:border-white/10 p-3">
                  {students.length ? students.map((s) => (
                    <label key={s._id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(s._id)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...(field.value || []), s._id]
                            : field.value.filter((id) => id !== s._id);
                          field.onChange(next);
                        }}
                        className="h-4 w-4 rounded accent-violet-500"
                      />
                      {s.user?.name} <span className="text-xs text-ink-600/40">({s.class?.name} - {s.section})</span>
                    </label>
                  )) : <p className="text-xs text-ink-600/50">No students available yet.</p>}
                </div>
              )}
            />
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full">{editing ? "Save changes" : "Add parent"}</button>
          </div>
        </form>
      </Modal>

      <CredentialsModal
        open={!!credentials}
        onClose={() => setCredentials(null)}
        credentials={credentials}
        personLabel="this parent"
      />
    </div>
  );
};

export default ParentList;
