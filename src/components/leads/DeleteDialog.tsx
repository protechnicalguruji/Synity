import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  companyName: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  companyName
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2 text-red-600 font-display font-bold">
          <AlertTriangle size={18} />
          Soft Confirm Deletion
        </span>
      }
      size="sm"
    >
      <div className="space-y-5 text-left">
        <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
          <p className="text-xs text-red-800 leading-relaxed">
            You are about to remove <strong className="font-bold">{leadName}</strong> from <strong className="font-bold">{companyName}</strong>.
          </p>
          <p className="text-[11px] text-red-600 leading-relaxed">
            While this marks the lead as deleted, we support a temporary 10-second workspace UNDO recovery layer before activities and tasks are fully pruned.
          </p>
        </div>

        <p className="text-xs text-[#666666] leading-relaxed">
          Are you sure you want to proceed with archiving and removing this active sales pipeline track?
        </p>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
            onClick={onConfirm}
          >
            <Trash2 size={13} />
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
