import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.utils import resample
from joblib import dump

# 💡 Updated dataset with strong link: low salary -> At Risk
data = pd.DataFrame({
    'age': [22, 28, 35, 45, 23, 50, 30, 40, 26, 32, 38, 41, 27, 36, 43, 29, 24, 21, 23, 25],
    'salary': [250, 5000, 15000, 40000, 300, 60000, 20000, 35000, 1000, 700, 8000, 9000, 400, 45000, 1200, 600, 200, 150, 350, 500],
    'workload': [50, 50, 80, 20, 90, 10, 75, 25, 85, 95, 30, 35, 88, 15, 92, 80, 45, 60, 55, 50],
    'tenure': [2, 5, 10, 15, 1, 20, 8, 12, 1, 1, 6, 7, 1, 15, 1, 2, 1, 1, 2, 1],
    'performance_score': [7, 8, 3, 9, 2, 10, 4, 8, 3, 2, 6, 5, 1, 9, 2, 3, 8, 7, 6, 7],
    'satisfaction': [
        'Satisfied', 'Satisfied', 'At Risk', 'Satisfied',
        'At Risk', 'Satisfied', 'At Risk', 'Satisfied',
        'At Risk', 'At Risk', 'Satisfied', 'Satisfied',
        'At Risk', 'Satisfied', 'At Risk', 'At Risk',
        'At Risk', 'At Risk', 'At Risk', 'At Risk'  # ⬅️ Added more At Risk for low salary
    ]
})

# 🔥 Balance dataset
df_majority = data[data.satisfaction == 'Satisfied']
df_minority = data[data.satisfaction == 'At Risk']
df_minority_upsampled = resample(df_minority, replace=True, n_samples=len(df_majority), random_state=42)
data_balanced = pd.concat([df_majority, df_minority_upsampled])

# 🎯 Features & target
X = data_balanced[['age', 'salary', 'workload', 'tenure', 'performance_score']]
y = data_balanced['satisfaction']

# 🧠 Train model
model = RandomForestClassifier()
model.fit(X, y)

# 💾 Save model
dump(model, 'model.joblib')

print("✅ Model retrained: low salary will now predict At Risk!")
