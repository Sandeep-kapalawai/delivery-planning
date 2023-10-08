import re
import json
with open('UI/delivery-planning/package.json') as f:
    data = json.load(f)
version = re.search("([0-9]+[.]+[0-9]+[.]+[0-9])",
                    data['engines']['node']).group()
print(
    "##vso[task.setvariable variable=nodeversion;isOutput=true]{}".format(
        version
    )
)
