for file in src/components/Careers/Forms/*.tsx; do
  # Add onInvalid handler to the form tag
  sed -i 's/<form onSubmit={handleSubmit} className="application-form-premium" encType="multipart/form-data">/<form onSubmit={handleSubmit} onInvalid={(e) => { e.preventDefault(); setSubmitStatus({ type: "error", message: "Please fill out all required fields correctly." }); }} className="application-form-premium" encType="multipart/form-data">/g' "$file"
  
  sed -i 's/<form onSubmit={handleSubmit} className="application-form-premium">/<form onSubmit={handleSubmit} onInvalid={(e) => { e.preventDefault(); setSubmitStatus({ type: "error", message: "Please fill out all required fields correctly." }); }} className="application-form-premium">/g' "$file"

  # Duplicate the status message rendering right above form-actions-premium
  awk '/<div className="form-actions-premium">/{print "        {submitStatus && (\n          <div className={'"'status-message-premium ' + submitStatus.type"'} style={{ marginBottom: '"'1rem'"' }}>\n            <span className=\"status-icon\">{submitStatus.type === '"'success'"' ? '"'✓'"' : '"'⚠'"'}</span>\n            {submitStatus.message}\n          </div>\n        )}\n"}{print}' "$file" > tmp_file && mv tmp_file "$file"
done
