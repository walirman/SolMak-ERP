
export type Language = 'en' | 'bn';

export const translations = {
  en: {
    app_name: "SolMak ERP",
    modules: {
      DASHBOARD: "Dashboard",
      FINANCE: "Finance",
      INVENTORY: "Inventory",
      SUPPLIERS: "Suppliers",
      SALES: "Sales",
      OFFICE: "Office",
      HR: "HR",
      REPORTS: "Reports",
      SETTINGS: "Settings",
      LEGAL: "Legal",
      CATEGORIES: "Categories",
      SUPER_ADMIN: "Global Admin",
      COMMUNICATION: "Messages",
      SUPPORT_AI: "Support AI",
      ACCOUNTS: "Accounts",
      PURCHASE: "Purchase",
      ADMIN: "User Management"
    },
    header: {
      search_placeholder: "Search resources...",
      breadcrumb_root: "Modules"
    },
    sidebar: {
      admin_user: "Admin User",
      super_admin: "Super Admin"
    },
    dashboard: {
      revenue: "Total Revenue",
      projects: "Active Projects",
      orders: "New Orders",
      customers: "Total Customers",
      revenue_overview: "Revenue Overview",
      perf_dist: "Performance Distribution",
      sales: "Sales",
      support: "Support",
      ops: "Ops",
      it: "IT"
    },
    inventory: {
      title: "Inventory",
      subtitle: "Manage your product stock and availability.",
      add_item: "Add Item",
      all_items: "All Items",
      filter: "Filter",
      table: {
        product: "Product",
        sku: "SKU",
        stock: "Stock",
        price: "Price",
        status: "Status",
        action: "Action"
      },
      status: {
        in_stock: "In Stock",
        low_stock: "Low Stock",
        out_of_stock: "Out of Stock"
      },
      units: "units"
    },
    finance: {
      balance: "Available Balance",
      income: "Monthly Income",
      expense: "Monthly Expense",
      recent_tx: "Recent Transactions",
      view_all: "View All History",
      completed: "Completed",
      pending: "Pending"
    },
    support_ai: {
      welcome: "Hello! I'm your SolMak ERP Assistant. How can I help you today?",
      ready: "Ready to assist",
      placeholder: "Ask anything about ERP management...",
      powered_by: "Powered by Gemini 3",
      disclaimer: "AI may provide inaccurate info. Verification recommended."
    },
    admin: {
      title: "Organization Admin",
      subtitle: "Manage your team and their access levels.",
      add_user: "Add Employee",
      edit_user: "Edit Access",
      user_list: "Team Members",
      permissions: "Module Permissions",
      save_user: "Create ID",
      delete_confirm: "Are you sure you want to remove this user?"
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your account and business preferences.",
      profile: "Profile",
      preferences: "Branding",
      save: "Apply Changes"
    },
    common: {
      back_to_dashboard: "Back to Dashboard",
      construction_title: "Module Under Construction",
      construction_desc: "This feature is currently being prepared for deployment."
    }
  },
  bn: {
    app_name: "সোলম্যাক ইআরপি",
    modules: {
      DASHBOARD: "ড্যাশবোর্ড",
      FINANCE: "ফাইন্যান্স",
      INVENTORY: "ইনভেন্টরি",
      SUPPLIERS: "সরবরাহকারী",
      SALES: "বিক্রয়",
      OFFICE: "অফিস",
      HR: "এইচআর (জনবল)",
      REPORTS: "রিপোর্ট",
      SETTINGS: "সেটিংস",
      LEGAL: "আইনি",
      CATEGORIES: "ক্যাটাগরি",
      SUPER_ADMIN: "গ্লোবাল এডমিন",
      COMMUNICATION: "মেসেজ",
      SUPPORT_AI: "এআই সাপোর্ট",
      ACCOUNTS: "অ্যাকাউন্টস",
      PURCHASE: "পারচেজ",
      ADMIN: "ইউজার ম্যানেজমেন্ট"
    },
    header: {
      search_placeholder: "রিসোর্স খুঁজুন...",
      breadcrumb_root: "মডিউল"
    },
    sidebar: {
      admin_user: "এডমিন ইউজার",
      super_admin: "সুপার এডমিন"
    },
    dashboard: {
      revenue: "মোট রাজস্ব",
      projects: "চলমান প্রজেক্ট",
      orders: "নতুন অর্ডার",
      customers: "মোট গ্রাহক",
      revenue_overview: "রাজস্ব চিত্র",
      perf_dist: "পারফরম্যান্স বন্টন",
      sales: "বিক্রয়",
      support: "সাপোর্ট",
      ops: "অপারেশনস",
      it: "আইটি"
    },
    inventory: {
      title: "ইনভেন্টরি",
      subtitle: "আপনার পণ্যের স্টক এবং প্রাপ্যতা পরিচালনা করুন।",
      add_item: "আইটেম যোগ করুন",
      all_items: "সব আইটেম",
      filter: "ফিল্টার",
      table: {
        product: "পণ্য",
        sku: "এসকেইউ (SKU)",
        stock: "স্টক",
        price: "মূল্য",
        status: "অবস্থা",
        action: "অ্যাকশন"
      },
      status: {
        in_stock: "স্টকে আছে",
        low_stock: "স্টক কম",
        out_of_stock: "স্টক শেষ"
      },
      units: "টি"
    },
    finance: {
      balance: "বর্তমান ব্যালেন্স",
      income: "মাসিক আয়",
      expense: "মাসিক ব্যয়",
      recent_tx: "সাম্প্রতিক লেনদেন",
      view_all: "সব ইতিহাস দেখুন",
      completed: "সম্পন্ন",
      pending: "প্রক্রিয়াধীন"
    },
    support_ai: {
      welcome: "হ্যালো! আমি আপনার SolMak ইআরপি সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      ready: "সহায়তার জন্য প্রস্তুত",
      placeholder: "ইআরপি ব্যবস্থাপনা সম্পর্কে কিছু জিজ্ঞাসা করুন...",
      powered_by: "জেমিনি ৩ দ্বারা চালিত",
      disclaimer: "এআই ভুল তথ্য দিতে পারে। আর্থিক সিদ্ধান্তের জন্য যাচাইকরণ বাঞ্ছনীয়।"
    },
    admin: {
      title: "অর্গানাইজেশন এডমিন",
      subtitle: "আপনার টিম এবং তাদের এক্সেস লেভেল ম্যানেজ করুন।",
      add_user: "নতুন কর্মচারী যোগ করুন",
      edit_user: "এক্সেস পরিবর্তন",
      user_list: "টিম মেম্বার লিস্ট",
      permissions: "মডিউল পারমিশন",
      save_user: "আইডি তৈরি করুন",
      delete_confirm: "আপনি কি নিশ্চিত যে এই ইউজারকে মুছে ফেলতে চান?"
    },
    settings: {
      title: "সেটিংস",
      subtitle: "আপনার অ্যাকাউন্ট এবং বিজনেসের পছন্দগুলো পরিচালনা করুন।",
      profile: "প্রোফাইল",
      preferences: "ব্র্যান্ডিং",
      save: "পরিবর্তন সংরক্ষণ করুন"
    },
    common: {
      back_to_dashboard: "ড্যাশবোর্ডে ফিরে যান",
      construction_title: "মডিউলটি তৈরি হচ্ছে",
      construction_desc: "এই ফিচারটি বর্তমানে মোতায়েনের জন্য প্রস্তুত করা হচ্ছে।"
    }
  }
};
