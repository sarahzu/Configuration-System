from setuptools import find_packages, setup

setup(
    name='configuration',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask', 'dotenv'
    ],
)