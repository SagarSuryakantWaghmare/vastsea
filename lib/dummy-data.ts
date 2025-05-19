export interface Problem {
  id: string;
  title: string;
  description: string;
  codes: {
    java?: string;
    c?: string;
    cpp?: string;
    js?: string;
  };
  tags: string[];
}

export const dummyProblems: Problem[] = [
  {
    id: "1",
    title: "Reverse a String",
    description: "Write a function to reverse a string. The input string is given as an array of characters.",
    codes: {
      java: `public class Solution {
  public String reverseString(String s) {
    char[] chars = s.toCharArray();
    int left = 0, right = chars.length - 1;
    while (left < right) {
      char temp = chars[left];
      chars[left] = chars[right];
      chars[right] = temp;
      left++;
      right--;
    }
    return new String(chars);
  }
}`,
      c: `void reverseString(char* s, int sSize) {
  int left = 0, right = sSize - 1;
  while (left < right) {
    char temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
}`,
      cpp: `class Solution {
public:
  string reverseString(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
      swap(s[left], s[right]);
      left++;
      right--;
    }
    return s;
  }
};`,
      js: `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
    },
    tags: ["string", "easy", "two-pointers"],
  },
  {
    id: "2",
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    codes: {
      java: `public class Solution {
  public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
      int complement = target - nums[i];
      if (map.containsKey(complement)) {
        return new int[] { map.get(complement), i };
      }
      map.put(nums[i], i);
    }
    throw new IllegalArgumentException("No solution found");
  }
}`,
      cpp: `class Solution {
public:
  vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
      int complement = target - nums[i];
      if (map.find(complement) != map.end()) {
        return {map[complement], i};
      }
      map[nums[i]] = i;
    }
    return {};
  }
};`,
      js: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
};`,
    },
    tags: ["array", "hash-table", "easy"],
  },
  {
    id: "3",
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    codes: {
      java: `public class Solution {
  public boolean isPalindrome(int x) {
    if (x < 0) return false;
    int reverse = 0, original = x;
    while (x > 0) {
      reverse = reverse * 10 + x % 10;
      x /= 10;
    }
    return original == reverse;
  }
}`,
      c: `bool isPalindrome(int x) {
  if (x < 0) return false;
  long reverse = 0, original = x;
  while (x > 0) {
    reverse = reverse * 10 + x % 10;
    x /= 10;
  }
  return original == reverse;
}`,
      js: `function isPalindrome(x) {
  if (x < 0) return false;
  const str = x.toString();
  return str === str.split('').reverse().join('');
};`,
    },
    tags: ["math", "easy"],
  },
  {
    id: "4",
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    codes: {
      java: `public class Solution {
  public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
      if (c == '(' || c == '[' || c == '{') {
        stack.push(c);
      } else {
        if (stack.isEmpty()) return false;
        char top = stack.pop();
        if ((c == ')' && top != '(') || 
            (c == ']' && top != '[') || 
            (c == '}' && top != '{')) {
          return false;
        }
      }
    }
    return stack.isEmpty();
  }
}`,
      cpp: `class Solution {
public:
  bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
      if (c == '(' || c == '[' || c == '{') {
        st.push(c);
      } else {
        if (st.empty()) return false;
        char top = st.top();
        st.pop();
        if ((c == ')' && top != '(') || 
            (c == ']' && top != '[') || 
            (c == '}' && top != '{')) {
          return false;
        }
      }
    }
    return st.empty();
  }
};`,
      js: `function isValid(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
};`,
    },
    tags: ["string", "stack", "easy"],
  },
  {
    id: "5",
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
    codes: {
      java: `public class Solution {
  public int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }
}`,
      c: `int fib(int n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`,
      cpp: `class Solution {
public:
  int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
  }
};`,
      js: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
};`,
    },
    tags: ["math", "dynamic-programming", "recursion", "easy"],
  },
  {
    id: "6",
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists and return it as a sorted list.",
    codes: {
      java: `public class Solution {
  public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    
    while (l1 != null && l2 != null) {
      if (l1.val <= l2.val) {
        current.next = l1;
        l1 = l1.next;
      } else {
        current.next = l2;
        l2 = l2.next;
      }
      current = current.next;
    }
    
    current.next = l1 != null ? l1 : l2;
    return dummy.next;
  }
}`,
      cpp: `class Solution {
public:
  ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* current = &dummy;
    
    while (l1 && l2) {
      if (l1->val <= l2->val) {
        current->next = l1;
        l1 = l1->next;
      } else {
        current->next = l2;
        l2 = l2->next;
      }
      current = current->next;
    }
    
    current->next = l1 ? l1 : l2;
    return dummy.next;
  }
};`,
      js: `function mergeTwoLists(l1, l2) {
  const dummy = { val: 0, next: null };
  let current = dummy;
  
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  
  current.next = l1 || l2;
  return dummy.next;
};`,
    },
    tags: ["linked-list", "recursion", "easy"],
  },
];