#!/usr/bin/env python3
"""
Script to categorize uncategorized n8n workflows based on filename patterns.
This will help reduce the count of uncategorized workflows.
"""

import json
from collections import defaultdict

def load_categories():
    """Load the search categories file."""
    with open('context/search_categories.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def load_unique_categories():
    """Load the unique categories list."""
    with open('context/unique_categories.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def categorize_by_filename(filename):
    """
    Categorize workflow based on filename patterns.
    Returns the most likely category or None if uncertain.
    """
    filename_lower = filename.lower()
    
    # Security & Authentication
    if any(word in filename_lower for word in ['totp', 'bitwarden', 'auth', 'security']):
        return "Technical Infrastructure & DevOps"
    
    # Data Processing & File Operations
    if any(word in filename_lower for word in ['process', 'writebinaryfile', 'readbinaryfile', 'extractfromfile', 'converttofile']):
        return "Data Processing & Analysis"
    
    # Utility & Business Process Automation
    if any(word in filename_lower for word in ['noop', 'code', 'schedule', 'filter', 'splitout', 'wait', 'limit', 'aggregate']):
        return "Business Process Automation"
    
    # Webhook & API related
    if any(word in filename_lower for word in ['webhook', 'respondtowebhook', 'http']):
        return "Web Scraping & Data Extraction"
    
    # Form & Data Collection
    if any(word in filename_lower for word in ['form', 'typeform', 'jotform']):
        return "Data Processing & Analysis"
    
    # Local file operations
    if any(word in filename_lower for word in ['localfile', 'filemaker']):
        return "Cloud Storage & File Management"
    
    # Database operations
    if any(word in filename_lower for word in ['postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'snowflake']):
        return "Data Processing & Analysis"
    
    # AI & Machine Learning
    if any(word in filename_lower for word in ['openai', 'awstextract', 'awsrekognition', 'humanticai', 'openthesaurus']):
        return "AI Agent Development"
    
    # E-commerce specific
    if any(word in filename_lower for word in ['woocommerce', 'gumroad']):
        return "E-commerce & Retail"
    
    # Social media specific
    if any(word in filename_lower for word in ['facebook', 'linkedin', 'instagram']):
        return "Social Media Management"
    
    # Customer support
    if any(word in filename_lower for word in ['zendesk', 'intercom', 'drift', 'pagerduty']):
        return "Communication & Messaging"
    
    # Analytics & Tracking
    if any(word in filename_lower for word in ['googleanalytics', 'segment', 'mixpanel']):
        return "Data Processing & Analysis"
    
    # Development tools
    if any(word in filename_lower for word in ['git', 'github', 'gitlab', 'travisci', 'jenkins']):
        return "Technical Infrastructure & DevOps"
    
    # CRM & Sales tools
    if any(word in filename_lower for word in ['pipedrive', 'hubspot', 'salesforce', 'copper', 'orbit']):
        return "CRM & Sales"
    
    # Marketing tools
    if any(word in filename_lower for word in ['mailchimp', 'convertkit', 'sendgrid', 'mailerlite', 'lemlist']):
        return "Marketing & Advertising Automation"
    
    # Project management
    if any(word in filename_lower for word in ['asana', 'mondaycom', 'clickup', 'trello', 'notion']):
        return "Project Management"
    
    # Communication
    if any(word in filename_lower for word in ['slack', 'telegram', 'discord', 'mattermost', 'twilio']):
        return "Communication & Messaging"
    
    # Cloud storage
    if any(word in filename_lower for word in ['dropbox', 'googledrive', 'onedrive', 'awss3']):
        return "Cloud Storage & File Management"
    
    # Creative tools
    if any(word in filename_lower for word in ['canva', 'figma', 'bannerbear', 'editimage']):
        return "Creative Design Automation"
    
    # Video & content
    if any(word in filename_lower for word in ['youtube', 'vimeo', 'storyblok', 'strapi']):
        return "Creative Content & Video Automation"
    
    # Financial tools
    if any(word in filename_lower for word in ['stripe', 'chargebee', 'quickbooks', 'harvest']):
        return "Financial & Accounting"
    
    # Weather & external APIs
    if any(word in filename_lower for word in ['openweathermap', 'nasa', 'crypto', 'coingecko']):
        return "Web Scraping & Data Extraction"
    
    return None

def main():
    """Main function to categorize workflows."""
    print("Loading workflow categories...")
    workflows = load_categories()
    unique_categories = load_unique_categories()
    
    print(f"Total workflows: {len(workflows)}")
    
    # Count current categories
    category_counts = defaultdict(int)
    uncategorized_count = 0
    
    for workflow in workflows:
        if workflow['category']:
            category_counts[workflow['category']] += 1
        else:
            uncategorized_count += 1
    
    print(f"\nCurrent category distribution:")
    for category, count in sorted(category_counts.items()):
        print(f"  {category}: {count}")
    print(f"  Uncategorized: {uncategorized_count}")
    
    # Identify uncategorized workflows
    uncategorized_workflows = [w for w in workflows if not w['category']]
    
    print(f"\nAnalyzing {len(uncategorized_workflows)} uncategorized workflows...")
    
    # Categorize based on filename patterns
    suggested_categories = {}
    uncertain_workflows = []
    
    for workflow in uncategorized_workflows:
        filename = workflow['filename']
        suggested_category = categorize_by_filename(filename)
        
        if suggested_category:
            suggested_categories[filename] = suggested_category
        else:
            uncertain_workflows.append(filename)
    
    print(f"\nSuggested categorizations: {len(suggested_categories)}")
    print(f"Still uncertain: {len(uncategorized_workflows)}")
    
    # Show suggested categorizations
    if suggested_categories:
        print("\nSuggested categorizations:")
        for filename, category in sorted(suggested_categories.items()):
            print(f"  {filename} → {category}")
    
    # Show uncertain workflows
    if uncertain_workflows:
        print(f"\nWorkflows that need manual review:")
        for filename in sorted(uncertain_workflows):
            print(f"  {filename}")
    
    # Calculate potential improvement
    potential_categorized = len(suggested_categories)
    new_uncategorized_count = uncategorized_count - potential_categorized
    
    print(f"\nPotential improvement:")
    print(f"  Current uncategorized: {uncategorized_count}")
    print(f"  After auto-categorization: {new_uncategorized_count}")
    print(f"  Reduction: {potential_categorized} workflows ({potential_categorized/uncategorized_count*100:.1f}%)")
    
    # Ask if user wants to apply suggestions
    if suggested_categories:
        response = input(f"\nWould you like to apply these {len(suggested_categories)} suggested categorizations? (y/n): ")
        
        if response.lower() in ['y', 'yes']:
            # Apply the categorizations
            for workflow in workflows:
                if workflow['filename'] in suggested_categories:
                    workflow['category'] = suggested_categories[workflow['filename']]
            
            # Save the updated file
            with open('context/search_categories.json', 'w', encoding='utf-8') as f:
                json.dump(workflows, f, indent=2, ensure_ascii=False)
            
            print("✅ Categorizations applied and saved!")
            
            # Show new distribution
            new_category_counts = defaultdict(int)
            new_uncategorized_count = 0
            
            for workflow in workflows:
                if workflow['category']:
                    new_category_counts[workflow['category']] += 1
                else:
                    new_uncategorized_count += 1
            
            print(f"\nNew category distribution:")
            for category, count in sorted(new_category_counts.items()):
                print(f"  {category}: {count}")
            print(f"  Uncategorized: {new_uncategorized_count}")
        else:
            print("No changes applied.")

if __name__ == "__main__":
    main()