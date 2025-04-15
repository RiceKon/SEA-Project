import pandas as pd

# 1. Load the CSV into a DataFrame
df = pd.read_csv('extended_keyboards_specs.csv')  

# 2. Convert the DataFrame to a list of dictionaries (records)
keyboard_list = df.to_dict(orient='records')

# If you want to save it into a file called 'extended_keyboards_specs.json':
import json
with open('extended_keyboards_specs.json', 'w', encoding='utf-8') as f:
    json.dump(keyboard_list, f, ensure_ascii=False, indent=2)
