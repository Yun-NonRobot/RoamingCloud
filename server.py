from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
OUTPUT_FOLDER = os.path.join(os.getcwd(), 'outputs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'file1' not in request.files or 'file2' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    file1 = request.files['file1']
    file2 = request.files['file2']

    file1_path = os.path.join(UPLOAD_FOLDER, file1.filename)
    file2_path = os.path.join(UPLOAD_FOLDER, file2.filename)

    file1.save(file1_path)
    file2.save(file2_path)

    try:
    
        df1 = pd.read_excel(file1_path)
        df2 = pd.read_excel(file2_path)

        # Print columns for debugging
        print("df1 columns:", df1.columns.tolist())
        print("df2 columns:", df2.columns.tolist())

        df1.rename(columns={'客户名称': 'Name', '分红': 'Bonus', '超额': 'Excess'}, inplace=True)
        df2.columns = df2.iloc[0]
        df2 = df2[1:]
        df2.rename(columns={'受益人名称': 'Name', '分配金额': 'Allocated Amount', '业绩报酬': 'Performance Compensation'}, inplace=True)

        # Remove datetime columns before summing to avoid errors
        df1_non_datetime = df1.select_dtypes(exclude=['datetime64[ns]', 'datetime64[ns, UTC]'])
        df1_grouped = df1_non_datetime.groupby('Name', as_index=False).sum()

        df1_relevant = df1_grouped[['Name', 'Bonus', 'Excess']]
        df2_relevant = df2[['Name', 'Allocated Amount', 'Performance Compensation']]

        # Merge dataframes on 'Name' using outer join to include all names
        merged_df = pd.merge(df1_relevant, df2_relevant, on='Name', how='outer')
        merged_df['Allocated Amount vs Bonus'] = (merged_df['Allocated Amount'].fillna(0) - merged_df['Bonus'].fillna(0)).round(2)
        merged_df['Performance Compensation vs Excess'] = (merged_df['Performance Compensation'].fillna(0) - merged_df['Excess'].fillna(0)).round(2)
        merged_df['Name'].fillna('合计', inplace=True)

        # Deal with last row 合计 names
        if '合计' in merged_df['Name'].values:
            合计_idx = merged_df[merged_df['Name'] == '合计'].index[0]
            allocated_amount = merged_df.at[合计_idx, 'Allocated Amount']
            bonus = df1['Bonus'].sum() - merged_df['Bonus'].sum()
            merged_df.at[合计_idx, 'Allocated Amount vs Bonus'] = (allocated_amount - bonus).round(2)
            performance_compensation = merged_df.at[合计_idx, 'Performance Compensation']
            excess = df1['Excess'].sum() - merged_df['Excess'].sum()
            merged_df.at[合计_idx, 'Performance Compensation vs Excess'] = (performance_compensation - excess).round(2)

        final_df = merged_df[['Name', 'Allocated Amount vs Bonus', 'Performance Compensation vs Excess']]
        final_df = final_df.drop_duplicates(subset=['Name'])

        output_filename = 'differences_output.xlsx'
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        final_df.to_excel(output_path, index=False)

        # Check if the file exists before returning
        if os.path.exists(output_path):
            return jsonify({'message': 'Differences calculated and saved', 'output_path': output_filename}), 200
        else:
            return jsonify({'error': 'File not saved correctly'}), 500
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    print(f"Full file path to send: {file_path}")  # Debugging line to see file path
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        print(f"File not found: {file_path}")  # Debugging line to see file not found
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
