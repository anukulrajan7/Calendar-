import React from 'react';

interface ModalProps {
	title: string;
	onClose: () => void;
	onSubmit: () => void;
	children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
	title,
	onClose,
	onSubmit,
	children,
}) => {
	return (
		<div className="modal modal-open">
			<div className="modal-box">
				<h3 className="font-bold text-lg">{title}</h3>
				<div className="py-4">{children}</div>
				<div className="modal-action">
					<button className="btn btn-primary" onClick={onSubmit}>
						Save
					</button>
					<button className="btn" onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
