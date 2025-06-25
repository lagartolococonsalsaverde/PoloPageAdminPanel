import React, { useEffect, useState } from 'react';
import LoggedinLayout from '../../components/LoggedinLayout';
import { fetchSmsTemplates, updateSmsTemplates } from '../../services/templates.api';
import { toast } from 'react-toastify';

const ProductTitleTemplates = () => {
    const [smsTemplates, setSmsTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateBody, setTemplateBody] = useState('');

    useEffect(() => {
        const getSmsTemplates = async () => {
            try {
                const response = await fetchSmsTemplates();
                setSmsTemplates(response);
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setLoading(false);
            }
        };
        getSmsTemplates();
    }, []);

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setTemplateBody(template.body);
    };

    const handleSave = async () => {
        if (!editingTemplate) return;
        
        setSaveLoading(true);
        try {
            const response = await updateSmsTemplates(editingTemplate.templateId, templateBody);
            if (response) {
                toast.success("Template Updated Successfully");
                // Update the local state
                setSmsTemplates(prevTemplates => 
                    prevTemplates.map(t => 
                        t.templateId === editingTemplate.templateId 
                            ? { ...t, body: templateBody }
                            : t
                    )
                );
                setEditingTemplate(null);
            }
        } catch (error) {
            toast.error("Failed to update template");
        } finally {
            setSaveLoading(false);
        }
    };

    const productTitleTemplate = smsTemplates.find(t => t.purpose === 'productTitle');

    return (
        <LoggedinLayout>
            <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Product Title Template</h2>

                {loading ? (
                    <p className='w-full py-4 text-center text-gray-600'>Loading template...</p>
                ) : productTitleTemplate ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Body</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {productTitleTemplate.purpose}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {editingTemplate?.templateId === productTitleTemplate.templateId ? (
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                value={templateBody}
                                                onChange={(e) => setTemplateBody(e.target.value)}
                                            />
                                        ) : (
                                            productTitleTemplate.body
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {editingTemplate?.templateId === productTitleTemplate.templateId ? (
                                            <button
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                                onClick={handleSave}
                                                disabled={saveLoading}
                                            >
                                                {saveLoading ? "Saving..." : "Save"}
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                                onClick={() => handleEdit(productTitleTemplate)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mt-4 text-xs text-gray-500">
                            To dynamically load data, use placeholders like <span className="font-medium">{'{name}'}</span>, <span className="font-medium">{'{petname}'}</span>, or <span className="font-medium">{'{url}'}</span> to display the respective values.
                        </p>
                    </div>
                ) : (
                    <p className='w-full py-4 text-center text-gray-600'>No product title template found</p>
                )}
            </div>
        </LoggedinLayout>
    );
};

export default ProductTitleTemplates;
