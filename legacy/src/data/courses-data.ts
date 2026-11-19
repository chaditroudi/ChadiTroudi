/* ── Structured Learning Content Data ── */

export type LessonType = "video" | "slides" | "interactive" | "exercise";
export type ResourceType = "pdf" | "notes" | "recording";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  xpReward: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  description: string;
  content: string;
  videoUrl?: string;
  slides?: string[];
  codeTemplate?: string;
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: CourseLesson[];
  quiz: Quiz;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: DifficultyLevel;
  category: string;
  estimatedHours: number;
  modules: Module[];
  instructor: string;
  tags: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  category: string;
  description: string;
  url: string;
  size: string;
  dateAdded: string;
  courseId?: string;
  tags: string[];
}

/* ── COURSES ── */

export const courses: Course[] = [
  {
    id: "java-fundamentals",
    title: "Java Fundamentals",
    description: "Master Java from zero to hero — OOP, data structures, and real project building.",
    icon: "☕",
    color: "amber",
    difficulty: "beginner",
    category: "Backend",
    estimatedHours: 60,
    instructor: "Chadi Troudi",
    tags: ["Java", "OOP", "Collections", "Streams", "JDBC", "Concurrency", "Design Patterns"],
    modules: [
      {
        id: "java-m1",
        title: "Getting Started with Java",
        description: "Environment setup, first program, variables, and data types.",
        icon: "🚀",
        lessons: [
          { id: "java-m1-l1", title: "Installing JDK & IDE Setup", type: "video", duration: 15, description: "Set up your Java development environment with IntelliJ IDEA.", content: "In this lesson, you'll install JDK 21 and configure IntelliJ IDEA for Java development. We'll walk through downloading the JDK, setting JAVA_HOME, and creating your first project in IntelliJ.\n\nSteps:\n1. Download JDK 21 from Oracle or Adoptium\n2. Install and set JAVA_HOME environment variable\n3. Download IntelliJ IDEA Community Edition\n4. Create a new Java project\n5. Configure the project SDK", xpReward: 15 },
          { id: "java-m1-l2", title: "Your First Java Program", type: "interactive", duration: 20, description: "Write, compile, and run Hello World with interactive guidance.", content: "Let's write our very first Java program. Every Java program needs a class and a main method. The main method is the entry point of your application.\n\nKey concepts:\n- Every Java file must have a class\n- The filename must match the class name\n- The main method signature: public static void main(String[] args)\n- System.out.println() prints to the console", codeTemplate: "public class HelloWorld {\n  public static void main(String[] args) {\n    // Write your first message here\n    System.out.println(\"Hello, World!\");\n    \n    // Try printing your name\n    \n  }\n}", xpReward: 25 },
          { id: "java-m1-l3", title: "Variables & Data Types", type: "slides", duration: 25, description: "Understand primitive types, strings, and type casting.", content: "Java has 8 primitive types:\n\n• byte (8-bit): -128 to 127\n• short (16-bit): -32,768 to 32,767\n• int (32-bit): ~±2 billion\n• long (64-bit): very large numbers\n• float (32-bit decimal)\n• double (64-bit decimal)\n• char (16-bit Unicode character)\n• boolean (true/false)\n\nStrings are objects, not primitives. They're immutable — once created, they can't be changed.\n\nType Casting:\n- Widening (automatic): int → double\n- Narrowing (manual): double → int requires (int) cast", slides: ["Primitives Overview", "Strings & Characters", "Type Casting", "Practice Problems"], xpReward: 20 },
          { id: "java-m1-l4", title: "Variables Exercise", type: "exercise", duration: 30, description: "Practice declaring variables and performing type conversions.", content: "Complete the following exercises to solidify your understanding of Java variables and data types.", codeTemplate: "public class VariablesExercise {\n  public static void main(String[] args) {\n    // Exercise 1: Declare an integer named \"age\" with your age\n    \n    // Exercise 2: Declare a double named \"gpa\" with value 3.75\n    \n    // Exercise 3: Convert the double to int and print it\n    \n    // Exercise 4: Declare a String with your full name\n    \n    // Exercise 5: Print all variables with labels\n    \n  }\n}", xpReward: 35 },
        ],
        quiz: {
          id: "java-m1-quiz",
          title: "Java Basics Quiz",
          passingScore: 70,
          xpReward: 50,
          questions: [
            { id: "q1", question: "Which keyword is used to declare a constant in Java?", options: ["const", "final", "static", "immutable"], correct: 1, explanation: "'final' is the keyword to make a variable constant in Java." },
            { id: "q2", question: "What is the default value of an int variable in Java?", options: ["null", "0", "undefined", "-1"], correct: 1, explanation: "Primitive int defaults to 0 in Java." },
            { id: "q3", question: "Which data type is used to store a single character?", options: ["String", "char", "Character", "byte"], correct: 1, explanation: "'char' stores a single 16-bit Unicode character." },
            { id: "q4", question: "What is the entry point of a Java application?", options: ["start() method", "init() method", "main() method", "run() method"], correct: 2, explanation: "The main method (public static void main) is where Java starts execution." },
          ],
        },
      },
      {
        id: "java-m2",
        title: "Control Flow",
        description: "Conditionals, loops, and logic that brings programs to life.",
        icon: "🔄",
        lessons: [
          { id: "java-m2-l1", title: "If-Else & Switch", type: "video", duration: 20, description: "Learn decision-making constructs in Java.", content: "Conditional statements allow programs to make decisions based on conditions.\n\nif-else:\n- Simple if: executes block when condition is true\n- if-else: alternative path when condition is false\n- else-if chain: multiple conditions checked in order\n\nSwitch:\n- Tests a variable against multiple values\n- Uses 'case' labels and 'break' to prevent fall-through\n- Java 14+ supports switch expressions with arrow syntax", xpReward: 20 },
          { id: "java-m2-l2", title: "For & While Loops", type: "interactive", duration: 25, description: "Master iteration patterns with hands-on coding.", content: "Loops let us execute a block of code repeatedly.\n\nfor loop: best when you know the number of iterations\nwhile loop: best when the condition determines when to stop\ndo-while: guarantees at least one execution\nfor-each: iterates over arrays and collections", codeTemplate: "public class LoopExercise {\n  public static void main(String[] args) {\n    // Print numbers 1 to 10 using a for loop\n    for (int i = 1; i <= 10; i++) {\n      System.out.println(i);\n    }\n    \n    // Now try a while loop to count down from 10 to 1\n    \n  }\n}", xpReward: 25 },
          { id: "java-m2-l3", title: "Nested Loops & Patterns", type: "exercise", duration: 35, description: "Build pattern programs using nested loops.", content: "Practice nested loops by printing star patterns and number pyramids.", codeTemplate: "public class PatternExercise {\n  public static void main(String[] args) {\n    // Print a right triangle of stars (5 rows)\n    // *\n    // **\n    // ***\n    // ****\n    // *****\n    \n    int rows = 5;\n    // Your code here\n    \n  }\n}", xpReward: 40 },
        ],
        quiz: {
          id: "java-m2-quiz",
          title: "Control Flow Quiz",
          passingScore: 70,
          xpReward: 50,
          questions: [
            { id: "q1", question: "Which loop guarantees at least one execution?", options: ["for", "while", "do-while", "foreach"], correct: 2, explanation: "do-while checks the condition after executing the body." },
            { id: "q2", question: "What does 'break' do inside a loop?", options: ["Skips current iteration", "Exits the loop", "Restarts the loop", "Throws error"], correct: 1, explanation: "'break' immediately exits the enclosing loop." },
            { id: "q3", question: "What does 'continue' do?", options: ["Exits the loop", "Skips to next iteration", "Pauses execution", "Goes to start"], correct: 1, explanation: "'continue' skips the rest of the current iteration." },
          ],
        },
      },
      {
        id: "java-m3",
        title: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, polymorphism, and encapsulation.",
        icon: "🏗️",
        lessons: [
          { id: "java-m3-l1", title: "Classes & Objects", type: "slides", duration: 30, description: "Understand the blueprint-instance relationship.", content: "A class is a blueprint for creating objects. An object is an instance of a class.\n\nKey concepts:\n- Fields: store object state\n- Methods: define object behavior\n- Constructors: initialize objects\n- 'this' keyword: refers to the current instance\n- Access modifiers: public, private, protected, default", slides: ["What is OOP?", "Classes", "Objects", "Constructors", "this keyword"], xpReward: 25 },
          { id: "java-m3-l2", title: "Inheritance & Polymorphism", type: "video", duration: 35, description: "Extend classes and override behavior.", content: "Inheritance allows a child class to inherit fields and methods from a parent class.\n\n- 'extends' keyword creates inheritance\n- 'super' calls parent constructor/methods\n- Method overriding: child provides its own implementation\n- Polymorphism: a parent reference can hold a child object\n- Abstract classes: can't be instantiated\n- Interfaces: contracts that classes must implement", xpReward: 30 },
          { id: "java-m3-l3", title: "Build a Mini Banking System", type: "exercise", duration: 45, description: "Apply OOP concepts by building a bank account system.", content: "Create a banking system using classes, inheritance, and encapsulation.\n\nRequirements:\n1. BankAccount base class with owner, balance\n2. SavingsAccount with interest rate\n3. CheckingAccount with overdraft limit\n4. Deposit, withdraw, and transfer methods\n5. Display account info", codeTemplate: "public class BankAccount {\n  private String owner;\n  private double balance;\n\n  public BankAccount(String owner, double initialBalance) {\n    this.owner = owner;\n    this.balance = initialBalance;\n  }\n\n  // TODO: Add deposit, withdraw, getBalance methods\n  \n}\n\n// TODO: Create SavingsAccount extends BankAccount\n// TODO: Create CheckingAccount extends BankAccount", xpReward: 50 },
        ],
        quiz: {
          id: "java-m3-quiz",
          title: "OOP Quiz",
          passingScore: 70,
          xpReward: 60,
          questions: [
            { id: "q1", question: "Which OOP principle hides internal details?", options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"], correct: 2, explanation: "Encapsulation bundles data with methods and restricts direct access." },
            { id: "q2", question: "Which keyword is used for inheritance in Java?", options: ["inherits", "extends", "implements", "super"], correct: 1, explanation: "'extends' is used to inherit from a parent class." },
            { id: "q3", question: "Can you instantiate an abstract class?", options: ["Yes", "No", "Only with static methods", "Only in main"], correct: 1, explanation: "Abstract classes cannot be instantiated directly." },
          ],
        },
      },
      {
        id: "java-m4",
        title: "Arrays & Strings",
        description: "Master array manipulation, multidimensional arrays, and String operations.",
        icon: "📊",
        lessons: [
          { id: "java-m4-l1", title: "Arrays: Creation & Manipulation", type: "video", duration: 25, description: "Declare, initialize, and traverse arrays in Java.", content: "Arrays are fixed-size containers that hold elements of the same type.\n\nDeclaration & Initialization:\n- int[] nums = new int[5];\n- int[] nums = {1, 2, 3, 4, 5};\n\nKey operations:\n- Access by index: nums[0]\n- Length: nums.length\n- Iterate: for loop or enhanced for-each\n- Arrays.sort() — sorts in-place\n- Arrays.copyOf() — creates a copy\n- Arrays.fill() — fills with a value\n- Arrays.toString() — prints array contents\n\nArrays are zero-indexed: first element is at index 0, last at length - 1.", xpReward: 20 },
          { id: "java-m4-l2", title: "Multidimensional Arrays", type: "interactive", duration: 25, description: "Work with 2D arrays, matrices, and jagged arrays.", content: "A 2D array is an array of arrays — think of it as a table with rows and columns.\n\nDeclaration:\nint[][] matrix = new int[3][4]; // 3 rows, 4 columns\nint[][] preset = {{1,2},{3,4},{5,6}};\n\nAccessing: matrix[row][col]\n\nJagged arrays have rows of different lengths:\nint[][] jagged = new int[3][];\njagged[0] = new int[2];\njagged[1] = new int[5];\n\nIteration: use nested for-each loops to traverse rows and columns.", codeTemplate: "public class MatrixOps {\n  public static void main(String[] args) {\n    int[][] matrix = {\n      {1, 2, 3},\n      {4, 5, 6},\n      {7, 8, 9}\n    };\n    // TODO: Print the matrix row by row\n    // TODO: Calculate the sum of the main diagonal\n    // TODO: Transpose the matrix into a new 2D array\n  }\n}", xpReward: 25 },
          { id: "java-m4-l3", title: "String Methods & StringBuilder", type: "slides", duration: 20, description: "Master Java's String class and efficient string building.", content: "Strings in Java are immutable objects.\n\nCommon methods:\n- length(), charAt(i), substring(start, end)\n- indexOf(str), contains(str), matches(regex)\n- toUpperCase(), toLowerCase(), trim(), strip()\n- split(regex), String.join(delimiter, elements)\n- equals() vs == (always use equals for content comparison)\n- compareTo() — lexicographic comparison\n\nStringBuilder — mutable alternative for loops:\n- append(), insert(), delete(), reverse()\n- toString() to convert back\n- Much faster than + concatenation in loops\n\nString.format(\"Hello %s, age %d\", name, age) for formatted strings.", slides: ["String Immutability & Pool", "Essential String Methods", "StringBuilder vs StringBuffer", "String Formatting & Regex Intro"], xpReward: 20 },
          { id: "java-m4-l4", title: "Array & String Challenges", type: "exercise", duration: 40, description: "Solve coding challenges using arrays and strings.", content: "Complete these challenges:\n1. Reverse an array in-place without extra array\n2. Find the second largest element\n3. Check if a string is a palindrome\n4. Count vowels and consonants\n5. Rotate an array by k positions to the right", codeTemplate: "public class ArrayStringChallenges {\n  public static void reverseArray(int[] arr) {\n    // Swap from both ends towards center\n  }\n\n  public static int secondLargest(int[] arr) {\n    // Track largest and second largest\n    return 0;\n  }\n\n  public static boolean isPalindrome(String s) {\n    // Compare characters from both ends\n    return false;\n  }\n\n  public static void main(String[] args) {\n    int[] arr = {5, 2, 8, 1, 9, 3};\n    reverseArray(arr);\n    System.out.println(java.util.Arrays.toString(arr));\n    System.out.println(\"Second largest: \" + secondLargest(new int[]{5, 2, 8, 1, 9}));\n    System.out.println(isPalindrome(\"racecar\"));\n  }\n}", xpReward: 45 },
        ],
        quiz: {
          id: "java-m4-quiz",
          title: "Arrays & Strings Quiz",
          passingScore: 70,
          xpReward: 55,
          questions: [
            { id: "q1", question: "What is the index of the first element in a Java array?", options: ["1", "0", "-1", "Depends on type"], correct: 1, explanation: "Java arrays are zero-indexed — the first element is at index 0." },
            { id: "q2", question: "Why are Java Strings immutable?", options: ["Performance only", "Thread safety, caching & security", "Compiler limitation", "They are mutable"], correct: 1, explanation: "Immutability provides thread safety, enables string pool caching, and ensures security." },
            { id: "q3", question: "Which class should you use for string concatenation in a loop?", options: ["String", "StringBuilder", "StringBuffer", "CharSequence"], correct: 1, explanation: "StringBuilder is mutable and much faster than String concatenation in loops." },
            { id: "q4", question: "What does Arrays.sort() return?", options: ["A sorted copy", "void", "A new array", "boolean"], correct: 1, explanation: "Arrays.sort() sorts the array in-place and returns void." },
          ],
        },
      },
      {
        id: "java-m5",
        title: "Collections Framework",
        description: "Lists, maps, sets, queues — the backbone of Java data management.",
        icon: "🗂️",
        lessons: [
          { id: "java-m5-l1", title: "ArrayList & LinkedList", type: "video", duration: 30, description: "Dynamic lists that grow and shrink automatically.", content: "Unlike arrays, collections resize dynamically.\n\nArrayList<E>:\n- Backed by a resizable array\n- Fast random access: O(1) get(index)\n- Slow insert/remove in middle: O(n)\n- add(), get(), set(), remove(), size(), contains()\n\nLinkedList<E>:\n- Doubly-linked node chain\n- Fast insert/remove at both ends: O(1)\n- Slow random access: O(n)\n- Also implements Deque — use as stack/queue\n\nChoose ArrayList for most cases; LinkedList only when you frequently insert/remove at the head.", xpReward: 25 },
          { id: "java-m5-l2", title: "HashMap, TreeMap & Sets", type: "slides", duration: 30, description: "Key-value maps and unique element sets.", content: "Maps store key-value pairs; Sets store unique elements.\n\nHashMap<K,V>:\n- O(1) average put/get/containsKey\n- No ordering guarantee\n- Allows one null key\n\nTreeMap<K,V>:\n- Sorted by key (natural or Comparator)\n- O(log n) operations\n- NavigableMap methods: firstKey(), floorKey()\n\nHashSet<E>:\n- Unique elements, no duplicates\n- O(1) add/contains/remove\n- Backed by a HashMap internally\n\nTreeSet<E>:\n- Sorted unique elements\n- O(log n) operations\n\nLinkedHashSet / LinkedHashMap: maintain insertion order.", slides: ["HashMap Internals", "TreeMap & Sorting", "HashSet & TreeSet", "Choosing the Right Collection"], xpReward: 25 },
          { id: "java-m5-l3", title: "Iterators & Comparators", type: "interactive", duration: 25, description: "Traverse collections and define custom sorting.", content: "Iterator<E>:\n- hasNext(), next(), remove()\n- Use to safely remove elements while iterating\n- ListIterator adds bidirectional traversal\n\nComparable<T>:\n- Implement compareTo(T other) in your class\n- Defines natural ordering\n- Collections.sort() uses this by default\n\nComparator<T>:\n- External comparison strategy\n- compare(T a, T b)\n- Lambda: (a, b) -> a.getName().compareTo(b.getName())\n- Comparator.comparing(Student::getGpa).reversed()", codeTemplate: "import java.util.*;\n\npublic class SortDemo {\n  public static void main(String[] args) {\n    List<String> names = new ArrayList<>(List.of(\"Zara\", \"Ali\", \"Mona\", \"Karim\"));\n    \n    // Sort alphabetically\n    Collections.sort(names);\n    System.out.println(names);\n    \n    // Sort by length using a Comparator\n    names.sort(Comparator.comparingInt(String::length));\n    System.out.println(names);\n    \n    // TODO: Sort in reverse alphabetical order\n  }\n}", xpReward: 30 },
          { id: "java-m5-l4", title: "Build a Student Grade Manager", type: "exercise", duration: 45, description: "Use collections to manage students, courses, and grades.", content: "Build a grade management system:\n1. Student class with name, id, Map<String, Double> grades\n2. Add/update grades for courses\n3. Calculate GPA per student\n4. Sort students by GPA\n5. Find top N students\n6. List all students in a specific course", codeTemplate: "import java.util.*;\n\nclass Student {\n  private String name;\n  private String id;\n  private Map<String, Double> grades = new HashMap<>();\n\n  public Student(String name, String id) {\n    this.name = name;\n    this.id = id;\n  }\n\n  public void addGrade(String course, double grade) {\n    grades.put(course, grade);\n  }\n\n  public double getGPA() {\n    // TODO: Calculate average of all grades\n    return 0.0;\n  }\n\n  // TODO: Add getters, toString\n}\n\npublic class GradeManager {\n  private List<Student> students = new ArrayList<>();\n\n  // TODO: addStudent, getTopStudents, getStudentsByCourse\n\n  public static void main(String[] args) {\n    // Test your implementation\n  }\n}", xpReward: 50 },
        ],
        quiz: {
          id: "java-m5-quiz",
          title: "Collections Quiz",
          passingScore: 70,
          xpReward: 55,
          questions: [
            { id: "q1", question: "Which collection guarantees insertion order?", options: ["HashSet", "HashMap", "LinkedHashMap", "TreeMap"], correct: 2, explanation: "LinkedHashMap maintains the order in which entries were inserted." },
            { id: "q2", question: "What is the average time complexity of HashMap.get()?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correct: 2, explanation: "HashMap uses hashing for O(1) average-case get operations." },
            { id: "q3", question: "Which interface should a class implement for natural ordering?", options: ["Comparator", "Comparable", "Iterable", "Serializable"], correct: 1, explanation: "Comparable<T> defines natural ordering via compareTo()." },
            { id: "q4", question: "Can a HashSet contain duplicate elements?", options: ["Yes", "No", "Only nulls", "Only primitives"], correct: 1, explanation: "HashSet automatically rejects duplicates based on hashCode() and equals()." },
          ],
        },
      },
      {
        id: "java-m6",
        title: "Exception Handling",
        description: "Write robust code that handles errors gracefully.",
        icon: "🛡️",
        lessons: [
          { id: "java-m6-l1", title: "Try-Catch-Finally & Exception Hierarchy", type: "video", duration: 25, description: "Understand Java's exception mechanism and class hierarchy.", content: "Exceptions are events that disrupt normal program flow.\n\nHierarchy:\nThrowable\n├─ Error (don't catch — JVM issues like OutOfMemoryError)\n└─ Exception\n   ├─ Checked (must handle — IOException, SQLException)\n   └─ RuntimeException (unchecked — NullPointerException, ArrayIndexOutOfBounds)\n\ntry-catch-finally:\ntry {\n  // risky code\n} catch (SpecificException e) {\n  // handle it\n} catch (Exception e) {\n  // fallback\n} finally {\n  // always runs — cleanup resources\n}\n\ntry-with-resources (Java 7+):\ntry (BufferedReader br = new BufferedReader(...)) {\n  // auto-closed\n}", xpReward: 20 },
          { id: "java-m6-l2", title: "Custom Exceptions & Best Practices", type: "slides", duration: 20, description: "Create your own exception types and learn best practices.", content: "Custom exceptions clarify domain errors.\n\npublic class InsufficientFundsException extends Exception {\n  private double amount;\n  public InsufficientFundsException(double amount) {\n    super(\"Insufficient funds: \" + amount);\n    this.amount = amount;\n  }\n}\n\nBest Practices:\n- Catch specific exceptions, not generic Exception\n- Don't swallow exceptions (empty catch blocks)\n- Use finally or try-with-resources for cleanup\n- Include meaningful messages\n- Don't use exceptions for control flow\n- Log exceptions with stack trace\n- Prefer unchecked for programming errors\n- Prefer checked for recoverable conditions", slides: ["Custom Exception Classes", "Checked vs Unchecked", "Best Practices", "Anti-Patterns to Avoid"], xpReward: 20 },
          { id: "java-m6-l3", title: "Exception Handling Exercise", type: "exercise", duration: 35, description: "Add robust error handling to a banking application.", content: "Refactor the banking app to handle:\n1. InsufficientFundsException for overdrafts\n2. InvalidAmountException for negative deposits\n3. AccountNotFoundException for bad lookups\n4. Proper logging messages\n5. Resource cleanup with try-with-resources", codeTemplate: "// Define custom exceptions\nclass InsufficientFundsException extends Exception {\n  public InsufficientFundsException(String msg) { super(msg); }\n}\n\nclass InvalidAmountException extends Exception {\n  public InvalidAmountException(String msg) { super(msg); }\n}\n\npublic class SafeBankAccount {\n  private String owner;\n  private double balance;\n\n  public SafeBankAccount(String owner, double balance) {\n    this.owner = owner;\n    this.balance = balance;\n  }\n\n  public void deposit(double amount) throws InvalidAmountException {\n    // TODO: Throw if amount <= 0\n    balance += amount;\n  }\n\n  public void withdraw(double amount) throws InsufficientFundsException, InvalidAmountException {\n    // TODO: Validate amount and balance\n    balance -= amount;\n  }\n\n  public static void main(String[] args) {\n    SafeBankAccount acc = new SafeBankAccount(\"Alice\", 1000);\n    try {\n      acc.withdraw(1500);\n    } catch (InsufficientFundsException | InvalidAmountException e) {\n      System.err.println(e.getMessage());\n    }\n  }\n}", xpReward: 40 },
        ],
        quiz: {
          id: "java-m6-quiz",
          title: "Exception Handling Quiz",
          passingScore: 70,
          xpReward: 50,
          questions: [
            { id: "q1", question: "Which block always executes, whether or not an exception occurs?", options: ["try", "catch", "finally", "throw"], correct: 2, explanation: "The finally block always executes, even if an exception is thrown or caught." },
            { id: "q2", question: "Which is a checked exception?", options: ["NullPointerException", "IOException", "ArrayIndexOutOfBoundsException", "ArithmeticException"], correct: 1, explanation: "IOException is checked — the compiler forces you to handle or declare it." },
            { id: "q3", question: "What does try-with-resources do?", options: ["Retries failed code", "Auto-closes resources", "Catches all exceptions", "Runs code in parallel"], correct: 1, explanation: "try-with-resources automatically calls close() on AutoCloseable resources." },
          ],
        },
      },
      {
        id: "java-m7",
        title: "File I/O & Serialization",
        description: "Read, write, and persist data to files and streams.",
        icon: "📁",
        lessons: [
          { id: "java-m7-l1", title: "Reading & Writing Files", type: "video", duration: 25, description: "Use Java I/O classes to work with text and binary files.", content: "Java offers multiple ways to read/write files.\n\nText files:\n- Files.readString(Path) — read entire file (Java 11+)\n- Files.readAllLines(Path) — read as List<String>\n- Files.writeString(Path, content) — write string\n- BufferedReader / BufferedWriter for large files\n\nBinary files:\n- FileInputStream / FileOutputStream\n- BufferedInputStream / BufferedOutputStream\n\nPaths:\n- Path.of(\"data\", \"file.txt\")\n- Paths.get(\"data/file.txt\")\n\nAlways use try-with-resources for I/O operations.", xpReward: 20 },
          { id: "java-m7-l2", title: "NIO.2 & File Operations", type: "interactive", duration: 30, description: "Modern file operations with java.nio.file.", content: "java.nio.file (NIO.2) provides a modern file API.\n\nFiles utility methods:\n- Files.exists(path), Files.isDirectory(path)\n- Files.createDirectory(path), Files.createFile(path)\n- Files.copy(src, dest), Files.move(src, dest)\n- Files.delete(path), Files.deleteIfExists(path)\n- Files.list(dir) — Stream<Path> of directory entries\n- Files.walk(dir) — recursive directory traversal\n- Files.find(dir, depth, matcher) — search files\n\nWatchService — monitor directory for changes:\nWatchService ws = FileSystems.getDefault().newWatchService();\ndir.register(ws, ENTRY_CREATE, ENTRY_MODIFY);", codeTemplate: "import java.nio.file.*;\nimport java.io.*;\n\npublic class FileOps {\n  public static void main(String[] args) throws IOException {\n    Path dir = Path.of(\"mydata\");\n    Files.createDirectories(dir);\n    \n    Path file = dir.resolve(\"notes.txt\");\n    Files.writeString(file, \"Hello from Java NIO!\\n\");\n    \n    // TODO: Append more lines to the file\n    // TODO: Read and print all lines\n    // TODO: List all files in the directory\n  }\n}", xpReward: 25 },
          { id: "java-m7-l3", title: "Build a File-Based Notes App", type: "exercise", duration: 40, description: "Create a CLI notes application that persists data to files.", content: "Build a command-line notes app:\n1. Create, read, update, delete notes (stored as .txt files)\n2. List all notes with dates\n3. Search notes by keyword\n4. Export all notes to a single summary file\n5. Handle file-not-found and permission errors gracefully", codeTemplate: "import java.nio.file.*;\nimport java.io.*;\nimport java.time.*;\nimport java.util.*;\n\npublic class NotesApp {\n  private static final Path NOTES_DIR = Path.of(\"notes\");\n\n  public static void createNote(String title, String content) throws IOException {\n    // TODO: Save note as title.txt with timestamp header\n  }\n\n  public static String readNote(String title) throws IOException {\n    // TODO: Read and return note content\n    return \"\";\n  }\n\n  public static List<String> listNotes() throws IOException {\n    // TODO: Return list of note filenames\n    return List.of();\n  }\n\n  public static List<String> searchNotes(String keyword) throws IOException {\n    // TODO: Return notes containing keyword\n    return List.of();\n  }\n\n  public static void main(String[] args) throws IOException {\n    Files.createDirectories(NOTES_DIR);\n    createNote(\"first\", \"My first note!\");\n    System.out.println(listNotes());\n    System.out.println(readNote(\"first\"));\n  }\n}", xpReward: 45 },
        ],
        quiz: {
          id: "java-m7-quiz",
          title: "File I/O Quiz",
          passingScore: 70,
          xpReward: 50,
          questions: [
            { id: "q1", question: "Which class reads text files line by line efficiently?", options: ["FileReader", "BufferedReader", "Scanner", "InputStream"], correct: 1, explanation: "BufferedReader uses an internal buffer for efficient line-by-line reading." },
            { id: "q2", question: "What does Files.walk() return?", options: ["List<File>", "Stream<Path>", "Iterator<Path>", "Path[]"], correct: 1, explanation: "Files.walk() returns a Stream<Path> for lazy recursive directory traversal." },
            { id: "q3", question: "Why use try-with-resources for I/O?", options: ["Faster execution", "Auto-closes resources", "Better error messages", "Required by compiler"], correct: 1, explanation: "try-with-resources automatically calls close(), preventing resource leaks." },
          ],
        },
      },
      {
        id: "java-m8",
        title: "Generics",
        description: "Write type-safe, reusable code with Java generics.",
        icon: "🔤",
        lessons: [
          { id: "java-m8-l1", title: "Generic Classes & Methods", type: "video", duration: 25, description: "Create classes and methods that work with any type.", content: "Generics let you write code that works with different types while keeping type safety.\n\nGeneric class:\npublic class Box<T> {\n  private T value;\n  public void set(T value) { this.value = value; }\n  public T get() { return value; }\n}\nBox<String> strBox = new Box<>();\n\nGeneric method:\npublic static <T> void printArray(T[] array) {\n  for (T item : array) System.out.println(item);\n}\n\nMultiple type parameters:\npublic class Pair<K, V> {\n  private K key;\n  private V value;\n}\n\nDiamond operator (<>) infers type from context (Java 7+).", xpReward: 25 },
          { id: "java-m8-l2", title: "Bounded Types & Wildcards", type: "slides", duration: 25, description: "Restrict generic types and use wildcards effectively.", content: "Bounded type parameters:\n- <T extends Number> — T must be Number or subclass\n- <T extends Comparable<T>> — T must be comparable\n- <T extends A & B> — multiple bounds\n\nWildcards:\n- <?> — unbounded: any type (read-only)\n- <? extends Number> — upper bound: Number or subclass\n- <? super Integer> — lower bound: Integer or superclass\n\nPECS principle (Producer Extends, Consumer Super):\n- Use extends when you read from a collection\n- Use super when you write to a collection\n\nList<? extends Number> nums = ...; // can read Number\nList<? super Integer> ints = ...; // can add Integer", slides: ["Upper Bounded Types", "Wildcards Explained", "PECS Principle", "Type Erasure"], xpReward: 25 },
          { id: "java-m8-l3", title: "Build a Generic Data Structure", type: "exercise", duration: 35, description: "Implement a generic linked list from scratch.", content: "Build a generic singly linked list:\n1. GenericLinkedList<T> with Node<T> inner class\n2. add(T), addFirst(T), addLast(T)\n3. get(int index), remove(int index)\n4. size(), isEmpty(), contains(T)\n5. Implement Iterable<T> for for-each support\n6. toString() that prints [a -> b -> c]", codeTemplate: "public class GenericLinkedList<T> implements Iterable<T> {\n  private static class Node<T> {\n    T data;\n    Node<T> next;\n    Node(T data) { this.data = data; }\n  }\n\n  private Node<T> head;\n  private int size;\n\n  public void add(T element) {\n    // TODO: Add to end of list\n  }\n\n  public T get(int index) {\n    // TODO: Return element at index\n    return null;\n  }\n\n  public int size() { return size; }\n\n  public java.util.Iterator<T> iterator() {\n    // TODO: Return an Iterator that walks the nodes\n    return null;\n  }\n\n  public static void main(String[] args) {\n    GenericLinkedList<String> list = new GenericLinkedList<>();\n    list.add(\"Hello\");\n    list.add(\"World\");\n    for (String s : list) System.out.println(s);\n  }\n}", xpReward: 45 },
        ],
        quiz: {
          id: "java-m8-quiz",
          title: "Generics Quiz",
          passingScore: 70,
          xpReward: 50,
          questions: [
            { id: "q1", question: "What does <T extends Comparable<T>> mean?", options: ["T is a Comparable", "T must implement Comparable", "T extends a class", "T is any type"], correct: 1, explanation: "It constrains T to types that implement the Comparable interface." },
            { id: "q2", question: "What is type erasure?", options: ["Removing unused types", "Generics replaced with Object at runtime", "Deleting type annotations", "Converting types"], correct: 1, explanation: "Java erases generic type info at compile time, replacing with Object or bounds." },
            { id: "q3", question: "What does PECS stand for?", options: ["Producer Extends Consumer Super", "Primitive Encapsulation Casting System", "Parameterized Entity Class Syntax", "Public Extended Class Structure"], correct: 0, explanation: "PECS: Use extends for producers (reading) and super for consumers (writing)." },
          ],
        },
      },
      {
        id: "java-m9",
        title: "Lambda Expressions & Functional Programming",
        description: "Write concise, functional-style code with lambdas and functional interfaces.",
        icon: "λ",
        lessons: [
          { id: "java-m9-l1", title: "Lambda Syntax & Functional Interfaces", type: "video", duration: 25, description: "Simplify code with lambda expressions.", content: "A lambda is an anonymous function that can be passed around.\n\nSyntax:\n(parameters) -> expression\n(parameters) -> { statements; }\n\nExamples:\n(a, b) -> a + b\nx -> x * x\n() -> System.out.println(\"Hello\")\n(String s) -> s.length()\n\nFunctional Interface = interface with exactly ONE abstract method.\n@FunctionalInterface\ninterface Greeting {\n  void sayHello(String name);\n}\nGreeting g = name -> System.out.println(\"Hi \" + name);\n\nLambdas replace anonymous inner classes for functional interfaces.", xpReward: 25 },
          { id: "java-m9-l2", title: "Built-in Functional Interfaces", type: "interactive", duration: 25, description: "Master Predicate, Function, Consumer, Supplier, and more.", content: "java.util.function provides key interfaces:\n\nPredicate<T>: T -> boolean\n  test(), and(), or(), negate()\n  Predicate<String> isLong = s -> s.length() > 5;\n\nFunction<T,R>: T -> R\n  apply(), andThen(), compose()\n  Function<String,Integer> len = String::length;\n\nConsumer<T>: T -> void\n  accept(), andThen()\n  Consumer<String> print = System.out::println;\n\nSupplier<T>: () -> T\n  get()\n  Supplier<Double> random = Math::random;\n\nUnaryOperator<T>: T -> T (special Function)\nBinaryOperator<T>: (T,T) -> T\nBiFunction<T,U,R>: (T,U) -> R", codeTemplate: "import java.util.function.*;\nimport java.util.*;\n\npublic class FunctionalDemo {\n  public static void main(String[] args) {\n    List<String> names = List.of(\"Alice\", \"Bob\", \"Charlie\", \"Dave\");\n\n    // Predicate: filter names longer than 3 chars\n    Predicate<String> longName = s -> s.length() > 3;\n\n    // Function: convert to uppercase\n    Function<String, String> toUpper = String::toUpperCase;\n\n    // TODO: Chain predicate + function to filter and transform\n    // TODO: Use Consumer to print each result\n    // TODO: Use Supplier to generate a default name\n  }\n}", xpReward: 25 },
          { id: "java-m9-l3", title: "Method References & Composition", type: "slides", duration: 20, description: "Shorthand lambda notation and function chaining.", content: "Method references are shorthand for lambdas that call a single method.\n\n4 types:\n1. Static: Math::abs         → x -> Math.abs(x)\n2. Instance (specific): str::length → () -> str.length()\n3. Instance (arbitrary): String::toLowerCase → s -> s.toLowerCase()\n4. Constructor: ArrayList::new → () -> new ArrayList<>()\n\nFunction composition:\nFunction<String,String> trim = String::trim;\nFunction<String,String> upper = String::toUpperCase;\nFunction<String,String> pipeline = trim.andThen(upper);\n\nPredicate composition:\nPredicate<Integer> positive = n -> n > 0;\nPredicate<Integer> even = n -> n % 2 == 0;\nPredicate<Integer> positiveAndEven = positive.and(even);", slides: ["4 Types of Method References", "Function Composition", "Predicate Chaining", "Real-World Examples"], xpReward: 20 },
          { id: "java-m9-l4", title: "Refactor to Functional Style", type: "exercise", duration: 35, description: "Transform imperative code to elegant functional code.", content: "Refactor the given imperative code to functional style:\n1. Replace manual loops with forEach + Consumer\n2. Replace if-filters with Predicate\n3. Replace transformations with Function + map\n4. Chain operations using composition\n5. Use method references where possible", codeTemplate: "import java.util.*;\nimport java.util.function.*;\n\npublic class FunctionalRefactor {\n  // IMPERATIVE VERSION - Refactor this to functional style\n  public static List<String> processNames(List<String> names) {\n    List<String> result = new ArrayList<>();\n    for (String name : names) {\n      if (name != null && name.length() > 2) {\n        String processed = name.trim().toUpperCase();\n        result.add(processed);\n      }\n    }\n    Collections.sort(result);\n    return result;\n  }\n\n  // TODO: Write a functional version using Predicate, Function, etc.\n  public static List<String> processNamesFunctional(List<String> names) {\n    return List.of(); // Replace with functional implementation\n  }\n\n  public static void main(String[] args) {\n    List<String> names = Arrays.asList(\"Alice\", null, \"Bo\", \"  Charlie  \", \"Dave\", null, \"Eve\");\n    System.out.println(processNames(names));\n    System.out.println(processNamesFunctional(names));\n  }\n}", xpReward: 40 },
        ],
        quiz: {
          id: "java-m9-quiz",
          title: "Lambdas & Functional Programming Quiz",
          passingScore: 70,
          xpReward: 55,
          questions: [
            { id: "q1", question: "What is a functional interface?", options: ["Any interface", "Interface with one abstract method", "Interface with lambdas", "Abstract class"], correct: 1, explanation: "A functional interface has exactly one abstract method and can be used with lambdas." },
            { id: "q2", question: "Which functional interface takes T and returns boolean?", options: ["Function", "Consumer", "Predicate", "Supplier"], correct: 2, explanation: "Predicate<T> takes a T and returns a boolean via its test() method." },
            { id: "q3", question: "What is String::toUpperCase an example of?", options: ["Static method reference", "Constructor reference", "Instance method reference (arbitrary)", "Lambda expression"], correct: 2, explanation: "String::toUpperCase is an instance method reference on an arbitrary String object." },
          ],
        },
      },
      {
        id: "java-m10",
        title: "Streams API",
        description: "Process collections of data with powerful, declarative pipelines.",
        icon: "🌊",
        lessons: [
          { id: "java-m10-l1", title: "Stream Creation & Pipeline Architecture", type: "video", duration: 25, description: "Understand how streams work under the hood.", content: "A Stream is a sequence of elements supporting pipeline operations.\n\nCreating streams:\n- collection.stream()\n- Arrays.stream(array)\n- Stream.of(a, b, c)\n- Stream.iterate(0, n -> n + 1)\n- Stream.generate(Math::random)\n- IntStream.range(0, 10)\n- Files.lines(path)\n\nPipeline = Source → Intermediate ops → Terminal op\n\nKey properties:\n- Streams are lazy — intermediate ops don't execute until a terminal op is called\n- Streams are single-use — can't be reused after terminal op\n- Streams don't modify the source collection\n- Can be sequential or parallel", xpReward: 25 },
          { id: "java-m10-l2", title: "Intermediate Operations", type: "interactive", duration: 30, description: "Transform, filter, and sort stream elements.", content: "Intermediate operations return a new Stream (lazy).\n\nfilter(Predicate<T>) — keep elements matching condition\nmap(Function<T,R>) — transform each element\nflatMap(Function<T, Stream<R>>) — flatten nested streams\nsorted() / sorted(Comparator) — sort elements\ndistinct() — remove duplicates\nlimit(n) — take first n elements\nskip(n) — skip first n elements\npeek(Consumer) — debug without modifying\n\nChaining:\nnames.stream()\n  .filter(n -> n.length() > 3)\n  .map(String::toUpperCase)\n  .sorted()\n  .distinct()\n  ...", codeTemplate: "import java.util.*;\nimport java.util.stream.*;\n\npublic class StreamOps {\n  public static void main(String[] args) {\n    List<String> words = List.of(\"hello\", \"world\", \"java\", \"streams\", \"hello\", \"api\", \"java\");\n\n    // TODO: Get unique words longer than 3 chars, sorted, uppercased\n    List<String> result = words.stream()\n      // .filter(...)\n      // .map(...)\n      // .distinct()\n      // .sorted()\n      .collect(Collectors.toList());\n\n    System.out.println(result);\n\n    // TODO: Flatten a list of lists\n    List<List<Integer>> nested = List.of(List.of(1,2), List.of(3,4), List.of(5));\n    // Use flatMap to get [1, 2, 3, 4, 5]\n  }\n}", xpReward: 30 },
          { id: "java-m10-l3", title: "Terminal Operations & Collectors", type: "slides", duration: 25, description: "Collect, reduce, and aggregate stream results.", content: "Terminal operations trigger pipeline execution.\n\ncollect(Collector) — the most versatile:\n  Collectors.toList(), toSet(), toMap()\n  Collectors.joining(\", \")\n  Collectors.groupingBy(Function)\n  Collectors.partitioningBy(Predicate)\n  Collectors.counting(), summingInt(), averagingDouble()\n  Collectors.toUnmodifiableList()\n\nreduce(identity, BinaryOperator) — combine elements:\n  int sum = nums.stream().reduce(0, Integer::sum);\n\nforEach(Consumer) — perform action on each element\ncount() — number of elements\nmin(Comparator) / max(Comparator) — Optional result\nfindFirst() / findAny() — Optional result\nanyMatch() / allMatch() / noneMatch() — boolean checks\ntoArray() — convert to array", slides: ["Terminal vs Intermediate", "Collectors In-Depth", "reduce() Patterns", "Parallel Streams Intro"], xpReward: 25 },
          { id: "java-m10-l4", title: "Data Processing Pipeline Challenge", type: "exercise", duration: 40, description: "Process real-world data using stream pipelines.", content: "Process a dataset of employees:\n1. Filter employees by department and salary range\n2. Group employees by department\n3. Calculate average salary per department\n4. Find highest-paid employee in each department\n5. Generate a salary report sorted by department\n6. Partition employees into above/below average salary", codeTemplate: "import java.util.*;\nimport java.util.stream.*;\n\nrecord Employee(String name, String department, double salary) {}\n\npublic class EmployeeAnalytics {\n  static List<Employee> employees = List.of(\n    new Employee(\"Alice\", \"Engineering\", 95000),\n    new Employee(\"Bob\", \"Engineering\", 88000),\n    new Employee(\"Charlie\", \"Marketing\", 72000),\n    new Employee(\"Diana\", \"Marketing\", 78000),\n    new Employee(\"Eve\", \"Engineering\", 102000),\n    new Employee(\"Frank\", \"HR\", 65000),\n    new Employee(\"Grace\", \"HR\", 70000),\n    new Employee(\"Hank\", \"Marketing\", 81000)\n  );\n\n  public static void main(String[] args) {\n    // TODO 1: Average salary per department\n    // TODO 2: Highest paid per department\n    // TODO 3: Employees earning > 80k, sorted by salary desc\n    // TODO 4: Partition into above/below company average\n  }\n}", xpReward: 50 },
        ],
        quiz: {
          id: "java-m10-quiz",
          title: "Streams API Quiz",
          passingScore: 70,
          xpReward: 55,
          questions: [
            { id: "q1", question: "Are stream intermediate operations eager or lazy?", options: ["Eager", "Lazy", "Depends on the operation", "Neither"], correct: 1, explanation: "Intermediate operations are lazy — they don't execute until a terminal operation is invoked." },
            { id: "q2", question: "Which Collector groups elements by a classifier?", options: ["toMap", "groupingBy", "partitioningBy", "joining"], correct: 1, explanation: "Collectors.groupingBy() groups elements into a Map based on a classifier function." },
            { id: "q3", question: "Can you reuse a stream after a terminal operation?", options: ["Yes", "No", "Only with reset()", "Only parallel streams"], correct: 1, explanation: "Streams are single-use; a new stream must be created from the source." },
            { id: "q4", question: "What does flatMap do?", options: ["Flattens nested streams into one", "Maps and filters", "Creates parallel stream", "Sorts elements"], correct: 0, explanation: "flatMap maps each element to a stream and flattens the results into a single stream." },
          ],
        },
      },
      {
        id: "java-m11",
        title: "Multithreading & Concurrency",
        description: "Harness multiple threads for parallel execution and high performance.",
        icon: "⚡",
        lessons: [
          { id: "java-m11-l1", title: "Threads: Creation & Lifecycle", type: "video", duration: 30, description: "Create threads and understand their lifecycle states.", content: "A thread is a lightweight unit of execution.\n\nCreating threads:\n1. Extend Thread class:\n   class MyThread extends Thread {\n     public void run() { /* work */ }\n   }\n   new MyThread().start();\n\n2. Implement Runnable (preferred):\n   Runnable task = () -> System.out.println(\"Running\");\n   new Thread(task).start();\n\nThread lifecycle:\nNEW → RUNNABLE → RUNNING → (BLOCKED/WAITING/TIMED_WAITING) → TERMINATED\n\nKey methods:\n- start() — begins execution (calls run())\n- sleep(ms) — pause current thread\n- join() — wait for thread to finish\n- interrupt() — signal thread to stop\n- Thread.currentThread() — get current thread\n- isAlive() — check if running", xpReward: 25 },
          { id: "java-m11-l2", title: "Synchronization & Thread Safety", type: "slides", duration: 30, description: "Prevent race conditions and ensure data consistency.", content: "Race condition: multiple threads modify shared data concurrently.\n\nsynchronized keyword:\n- Synchronized method: locks on 'this'\n  public synchronized void increment() { count++; }\n- Synchronized block: finer control\n  synchronized (lockObject) { /* critical section */ }\n\nvolatile: ensures visibility across threads\n  private volatile boolean running = true;\n\njava.util.concurrent.atomic:\n- AtomicInteger, AtomicLong, AtomicReference\n- Lock-free thread-safe operations\n- atomicInt.incrementAndGet()\n\nReentrantLock:\n- More flexible than synchronized\n- tryLock(), lockInterruptibly()\n- Supports fairness and conditions\n\nDeadlock: two threads waiting for each other's locks — avoid by consistent lock ordering.", slides: ["Race Conditions", "synchronized Keyword", "Atomic Variables", "ReentrantLock & Deadlock"], xpReward: 25 },
          { id: "java-m11-l3", title: "ExecutorService & CompletableFuture", type: "interactive", duration: 30, description: "Manage thread pools and compose async computations.", content: "ExecutorService manages a pool of threads.\n\nCreating executors:\n- Executors.newFixedThreadPool(4)\n- Executors.newCachedThreadPool()\n- Executors.newSingleThreadExecutor()\n- Executors.newScheduledThreadPool(2)\n\nSubmitting tasks:\n- executor.submit(Runnable) → Future<?>\n- executor.submit(Callable<T>) → Future<T>\n- future.get() — blocks until result ready\n\nCompletableFuture (Java 8+):\n- CompletableFuture.supplyAsync(() -> compute())\n- .thenApply(result -> transform(result))\n- .thenAccept(result -> consume(result))\n- .thenCompose(result -> nextAsync(result))\n- .thenCombine(other, (a,b) -> merge(a,b))\n- .exceptionally(ex -> fallback)\n\nAlways shutdown executors: executor.shutdown();", codeTemplate: "import java.util.concurrent.*;\n\npublic class AsyncDemo {\n  public static void main(String[] args) throws Exception {\n    ExecutorService pool = Executors.newFixedThreadPool(3);\n\n    // Submit tasks\n    Future<String> future = pool.submit(() -> {\n      Thread.sleep(1000);\n      return \"Task complete!\";\n    });\n    System.out.println(future.get());\n\n    // TODO: Use CompletableFuture to chain async operations\n    // 1. Fetch user data (simulate with supplyAsync)\n    // 2. Transform the data (thenApply)\n    // 3. Save results (thenAccept)\n\n    pool.shutdown();\n  }\n}", xpReward: 30 },
          { id: "java-m11-l4", title: "Build a Concurrent Download Manager", type: "exercise", duration: 45, description: "Build a multi-threaded system that processes tasks concurrently.", content: "Create a concurrent task processor:\n1. DownloadTask class with URL, progress, status\n2. Thread pool with configurable size\n3. Submit multiple download tasks concurrently\n4. Track progress of each task\n5. Handle failures gracefully with retry logic\n6. Await completion of all tasks with timeout", codeTemplate: "import java.util.concurrent.*;\nimport java.util.*;\n\nclass DownloadTask implements Callable<String> {\n  private final String url;\n  public DownloadTask(String url) { this.url = url; }\n\n  @Override\n  public String call() throws Exception {\n    // Simulate download with progress\n    System.out.println(Thread.currentThread().getName() + \" downloading: \" + url);\n    Thread.sleep((long)(Math.random() * 3000));\n    if (Math.random() < 0.2) throw new Exception(\"Download failed: \" + url);\n    return \"Downloaded: \" + url;\n  }\n}\n\npublic class DownloadManager {\n  private final ExecutorService pool;\n\n  public DownloadManager(int threads) {\n    this.pool = Executors.newFixedThreadPool(threads);\n  }\n\n  public void downloadAll(List<String> urls) {\n    // TODO: Submit all downloads, collect futures, process results\n  }\n\n  public void shutdown() { pool.shutdown(); }\n\n  public static void main(String[] args) {\n    DownloadManager dm = new DownloadManager(3);\n    dm.downloadAll(List.of(\"file1.zip\", \"file2.zip\", \"file3.zip\", \"file4.zip\", \"file5.zip\"));\n    dm.shutdown();\n  }\n}", xpReward: 50 },
        ],
        quiz: {
          id: "java-m11-quiz",
          title: "Multithreading Quiz",
          passingScore: 70,
          xpReward: 60,
          questions: [
            { id: "q1", question: "What is a race condition?", options: ["Threads competing for CPU", "Multiple threads modifying shared data unsafely", "Thread finishing first", "Deadlock variant"], correct: 1, explanation: "A race condition occurs when multiple threads access shared data concurrently without synchronization." },
            { id: "q2", question: "Which class provides lock-free atomic operations?", options: ["synchronized", "ReentrantLock", "AtomicInteger", "volatile"], correct: 2, explanation: "AtomicInteger uses CAS (Compare-And-Swap) for lock-free thread-safe operations." },
            { id: "q3", question: "What does CompletableFuture.thenApply() do?", options: ["Runs task in parallel", "Transforms the result when ready", "Waits for completion", "Handles exceptions"], correct: 1, explanation: "thenApply() takes the result of the previous stage and applies a transformation function." },
            { id: "q4", question: "Why call executor.shutdown()?", options: ["Frees memory", "Stops accepting new tasks and releases threads", "Kills running tasks", "Restarts the pool"], correct: 1, explanation: "shutdown() prevents new task submissions and allows running tasks to complete, then releases resources." },
          ],
        },
      },
      {
        id: "java-m12",
        title: "JDBC & Database Programming",
        description: "Connect Java applications to relational databases.",
        icon: "🗄️",
        lessons: [
          { id: "java-m12-l1", title: "JDBC Architecture & Connecting to Databases", type: "video", duration: 25, description: "Understand JDBC drivers and establish database connections.", content: "JDBC (Java Database Connectivity) is the standard API for database access.\n\nArchitecture:\nJava App → JDBC API → JDBC Driver → Database\n\nDriver types:\n- Type 4 (thin driver) — pure Java, most common\n- MySQL: com.mysql.cj.jdbc.Driver\n- PostgreSQL: org.postgresql.Driver\n\nConnecting:\nString url = \"jdbc:mysql://localhost:3306/mydb\";\nConnection conn = DriverManager.getConnection(url, user, pass);\n\nConnection properties:\n- Auto-commit: conn.setAutoCommit(false)\n- Isolation level: conn.setTransactionIsolation(...)\n- Always close connections in finally/try-with-resources\n\nConnection pooling (HikariCP) for production:\nHikariDataSource ds = new HikariDataSource();\nds.setJdbcUrl(url);", xpReward: 20 },
          { id: "java-m12-l2", title: "CRUD with PreparedStatement", type: "interactive", duration: 35, description: "Perform safe database operations with parameterized queries.", content: "PreparedStatement prevents SQL injection by parameterizing queries.\n\n// INSERT\nPreparedStatement ps = conn.prepareStatement(\n  \"INSERT INTO users (name, email) VALUES (?, ?)\");\nps.setString(1, name);\nps.setString(2, email);\nps.executeUpdate();\n\n// SELECT\nPreparedStatement ps = conn.prepareStatement(\n  \"SELECT * FROM users WHERE id = ?\");\nps.setInt(1, userId);\nResultSet rs = ps.executeQuery();\nwhile (rs.next()) {\n  String name = rs.getString(\"name\");\n  int age = rs.getInt(\"age\");\n}\n\n// UPDATE & DELETE follow the same pattern\n// Always use PreparedStatement, NEVER concatenate user input into SQL", codeTemplate: "import java.sql.*;\n\npublic class UserDAO {\n  private static final String URL = \"jdbc:h2:mem:testdb\";\n\n  public static void createTable(Connection conn) throws SQLException {\n    conn.createStatement().execute(\n      \"CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), email VARCHAR(100))\"\n    );\n  }\n\n  public static void insertUser(Connection conn, String name, String email) throws SQLException {\n    // TODO: Use PreparedStatement to insert safely\n  }\n\n  public static void listUsers(Connection conn) throws SQLException {\n    // TODO: Query all users and print them\n  }\n\n  public static void main(String[] args) throws SQLException {\n    try (Connection conn = DriverManager.getConnection(URL)) {\n      createTable(conn);\n      insertUser(conn, \"Alice\", \"alice@example.com\");\n      insertUser(conn, \"Bob\", \"bob@example.com\");\n      listUsers(conn);\n    }\n  }\n}", xpReward: 35 },
          { id: "java-m12-l3", title: "Transactions & Connection Pooling", type: "slides", duration: 25, description: "Ensure data integrity with transactions and optimize performance.", content: "Transactions group operations into an atomic unit.\n\ntry {\n  conn.setAutoCommit(false);\n  // operation 1\n  // operation 2\n  conn.commit();\n} catch (SQLException e) {\n  conn.rollback();\n}\n\nACID properties:\n- Atomicity: all or nothing\n- Consistency: valid state transitions\n- Isolation: concurrent transactions don't interfere\n- Durability: committed data persists\n\nIsolation levels:\n- READ_UNCOMMITTED (dirty reads)\n- READ_COMMITTED (no dirty reads)\n- REPEATABLE_READ (consistent reads)\n- SERIALIZABLE (full isolation, slowest)\n\nConnection Pooling:\n- HikariCP — fastest pool for Java\n- Configurable pool size, timeout, idle time\n- Avoids expensive connection creation per request", slides: ["ACID Properties", "Transaction Management", "Isolation Levels", "HikariCP Connection Pooling"], xpReward: 25 },
          { id: "java-m12-l4", title: "Build a Database Contact Manager", type: "exercise", duration: 45, description: "Create a full CRUD contact manager backed by a database.", content: "Build a contact management application:\n1. Contact table: id, name, phone, email, group_name, created_at\n2. DAO pattern: ContactDAO interface → JdbcContactDAO implementation\n3. CRUD: add, find, update, delete contacts\n4. Search by name or group\n5. Transaction support for bulk imports\n6. Proper resource cleanup and error handling", codeTemplate: "import java.sql.*;\nimport java.util.*;\n\nrecord Contact(int id, String name, String phone, String email, String group) {}\n\ninterface ContactDAO {\n  void add(Contact contact) throws SQLException;\n  Optional<Contact> findById(int id) throws SQLException;\n  List<Contact> findByGroup(String group) throws SQLException;\n  void update(Contact contact) throws SQLException;\n  void delete(int id) throws SQLException;\n  List<Contact> listAll() throws SQLException;\n}\n\npublic class JdbcContactDAO implements ContactDAO {\n  private final Connection conn;\n\n  public JdbcContactDAO(Connection conn) {\n    this.conn = conn;\n  }\n\n  // TODO: Implement all DAO methods using PreparedStatement\n\n  public void add(Contact c) throws SQLException {\n    // Use PreparedStatement\n  }\n\n  public Optional<Contact> findById(int id) throws SQLException {\n    return Optional.empty();\n  }\n\n  public List<Contact> findByGroup(String group) throws SQLException {\n    return List.of();\n  }\n\n  public void update(Contact c) throws SQLException {}\n  public void delete(int id) throws SQLException {}\n  public List<Contact> listAll() throws SQLException { return List.of(); }\n}", xpReward: 50 },
        ],
        quiz: {
          id: "java-m12-quiz",
          title: "JDBC Quiz",
          passingScore: 70,
          xpReward: 55,
          questions: [
            { id: "q1", question: "Why use PreparedStatement over Statement?", options: ["Better performance only", "Prevents SQL injection", "Required by JDBC spec", "Supports all SQL dialects"], correct: 1, explanation: "PreparedStatement parameterizes queries, preventing SQL injection attacks and improving performance." },
            { id: "q2", question: "What does conn.rollback() do?", options: ["Saves changes", "Undoes uncommitted changes", "Closes connection", "Restarts transaction"], correct: 1, explanation: "rollback() reverts all changes made in the current transaction back to the last commit point." },
            { id: "q3", question: "What is connection pooling?", options: ["Creating new connections per request", "Reusing pre-created connections", "Connecting to multiple databases", "Pooling SQL queries"], correct: 1, explanation: "Connection pooling maintains reusable connections, avoiding the overhead of creating them on each request." },
          ],
        },
      },
      {
        id: "java-m13",
        title: "Design Patterns in Java",
        description: "Apply proven solutions to common software design problems.",
        icon: "🏛️",
        lessons: [
          { id: "java-m13-l1", title: "Creational Patterns: Singleton, Factory, Builder", type: "slides", duration: 30, description: "Control object creation with proven patterns.", content: "Creational patterns manage how objects are created.\n\nSingleton — one instance globally:\npublic class Config {\n  private static final Config INSTANCE = new Config();\n  private Config() {}\n  public static Config getInstance() { return INSTANCE; }\n}\n\nFactory Method — delegate creation to subclasses:\npublic interface Shape { void draw(); }\npublic class ShapeFactory {\n  public Shape create(String type) {\n    return switch(type) {\n      case \"circle\" -> new Circle();\n      case \"square\" -> new Square();\n      default -> throw new IllegalArgumentException();\n    };\n  }\n}\n\nBuilder — construct complex objects step by step:\nUser user = new User.Builder(\"Alice\")\n  .email(\"alice@example.com\")\n  .age(28)\n  .build();", slides: ["Singleton Pattern", "Factory Method & Abstract Factory", "Builder Pattern", "When to Use Each"], xpReward: 25 },
          { id: "java-m13-l2", title: "Structural Patterns: Adapter, Decorator, Facade", type: "video", duration: 30, description: "Compose classes and objects for flexible architectures.", content: "Structural patterns deal with object composition.\n\nAdapter — convert one interface to another:\nclass LegacyPrinter { void printOld(String s) {...} }\nclass PrinterAdapter implements ModernPrinter {\n  private LegacyPrinter legacy;\n  public void print(String s) { legacy.printOld(s); }\n}\n\nDecorator — add behavior dynamically:\ninterface Coffee { double cost(); String desc(); }\nclass MilkDecorator implements Coffee {\n  private Coffee base;\n  public double cost() { return base.cost() + 0.50; }\n  public String desc() { return base.desc() + \" + Milk\"; }\n}\n\nFacade — simplified interface to complex subsystem:\nclass OrderFacade {\n  public void placeOrder(String item) {\n    inventory.check(item);\n    payment.process();\n    shipping.ship();\n  }\n}", xpReward: 25 },
          { id: "java-m13-l3", title: "Behavioral Patterns: Observer, Strategy, Command", type: "video", duration: 30, description: "Define how objects interact and communicate.", content: "Behavioral patterns manage algorithms and object interaction.\n\nObserver — notify subscribers of changes:\ninterface Listener { void onEvent(String data); }\nclass EventBus {\n  private List<Listener> listeners = new ArrayList<>();\n  public void subscribe(Listener l) { listeners.add(l); }\n  public void publish(String data) {\n    listeners.forEach(l -> l.onEvent(data));\n  }\n}\n\nStrategy — swap algorithms at runtime:\ninterface SortStrategy { void sort(int[] data); }\nclass Sorter {\n  private SortStrategy strategy;\n  public void setStrategy(SortStrategy s) { strategy = s; }\n  public void sort(int[] data) { strategy.sort(data); }\n}\n\nCommand — encapsulate actions as objects:\ninterface Command { void execute(); void undo(); }\n// Enables undo/redo, queuing, logging of operations", xpReward: 25 },
          { id: "java-m13-l4", title: "Apply Patterns to a Real Project", type: "exercise", duration: 45, description: "Refactor and extend a project using multiple design patterns.", content: "Refactor a notification system using design patterns:\n1. Singleton: NotificationManager\n2. Factory: Create Email, SMS, Push notifications\n3. Observer: Subscribe users to notification channels\n4. Strategy: Different formatting strategies (HTML, Plain, Markdown)\n5. Builder: Construct complex notification messages\n6. Decorator: Add logging, retry, throttling layers", codeTemplate: "import java.util.*;\n\n// TODO: Implement Singleton\nclass NotificationManager {\n  // Single instance that manages all notification channels\n}\n\n// TODO: Notification interface + Factory\ninterface Notification {\n  void send(String recipient, String message);\n}\n\nclass NotificationFactory {\n  // Create EmailNotification, SMSNotification, PushNotification\n}\n\n// TODO: Observer pattern for subscriptions\ninterface NotificationListener {\n  void onNotification(String channel, String message);\n}\n\n// TODO: Strategy for formatting\ninterface FormatStrategy {\n  String format(String title, String body);\n}\n\npublic class NotificationSystem {\n  public static void main(String[] args) {\n    // Demonstrate all patterns working together\n    // 1. Get manager instance (Singleton)\n    // 2. Create notifications (Factory)\n    // 3. Subscribe listeners (Observer)\n    // 4. Format messages (Strategy)\n    // 5. Send with decorators (Decorator)\n  }\n}", xpReward: 55 },
        ],
        quiz: {
          id: "java-m13-quiz",
          title: "Design Patterns Quiz",
          passingScore: 70,
          xpReward: 60,
          questions: [
            { id: "q1", question: "Which pattern ensures only one instance of a class?", options: ["Factory", "Singleton", "Builder", "Prototype"], correct: 1, explanation: "Singleton restricts instantiation to a single object using a private constructor." },
            { id: "q2", question: "What does the Observer pattern do?", options: ["Creates objects", "Notifies dependents of state changes", "Adapts interfaces", "Decorates behavior"], correct: 1, explanation: "Observer defines a one-to-many dependency so dependents are notified of changes." },
            { id: "q3", question: "Which pattern lets you swap algorithms at runtime?", options: ["Observer", "Command", "Strategy", "Decorator"], correct: 2, explanation: "Strategy encapsulates algorithms behind an interface, allowing runtime switching." },
            { id: "q4", question: "What is a key benefit of the Builder pattern?", options: ["Faster execution", "Construct complex objects step-by-step", "Thread safety", "Reduced memory"], correct: 1, explanation: "Builder separates construction from representation, ideal for objects with many optional parameters." },
          ],
        },
      },
      {
        id: "java-m14",
        title: "Capstone: Library Management System",
        description: "Apply everything you've learned to build a complete Java application from scratch.",
        icon: "🎓",
        lessons: [
          { id: "java-m14-l1", title: "Project Architecture & Planning", type: "slides", duration: 25, description: "Design the architecture and data model for the capstone project.", content: "We'll build a full Library Management System that uses:\n- OOP: Book, Member, Loan classes with inheritance\n- Collections: catalogs, member registries, loan tracking\n- Generics: type-safe repositories\n- Streams: search, filter, reports\n- File I/O: persist data to JSON/CSV files\n- Exception handling: custom library exceptions\n- Design patterns: DAO, Singleton, Observer, Strategy\n\nFeatures:\n1. Book catalog: add, remove, search, categorize\n2. Member management: register, track history\n3. Loan system: borrow, return, overdue tracking\n4. Search: by title, author, ISBN, category\n5. Reports: most borrowed, overdue, member activity\n6. Data persistence: save/load from files", slides: ["System Architecture", "Data Model & UML", "Package Structure", "Development Plan"], xpReward: 20 },
          { id: "java-m14-l2", title: "Core Implementation", type: "exercise", duration: 90, description: "Build the complete library system with all features.", content: "Implement the full Library Management System:\n\nPhase 1 — Domain model:\n- Book: isbn, title, author, category, available\n- Member: id, name, email, borrowHistory\n- Loan: book, member, borrowDate, dueDate, returned\n\nPhase 2 — Repositories:\n- GenericRepository<T> with CRUD operations\n- BookRepository, MemberRepository, LoanRepository\n\nPhase 3 — Services:\n- LibraryService: borrow, return, search, reports\n- Use Streams for all queries and aggregations\n\nPhase 4 — Persistence:\n- Save/load data to files\n- Handle concurrent access\n\nPhase 5 — CLI Interface:\n- Interactive menu-driven application", codeTemplate: "import java.util.*;\nimport java.time.*;\nimport java.util.stream.*;\n\n// Domain Classes\nclass Book {\n  private String isbn, title, author, category;\n  private boolean available = true;\n  // TODO: Constructor, getters, setters, toString\n}\n\nclass Member {\n  private String id, name, email;\n  private List<String> borrowHistory = new ArrayList<>();\n  // TODO: Constructor, getters, methods\n}\n\nclass Loan {\n  private Book book;\n  private Member member;\n  private LocalDate borrowDate, dueDate;\n  private boolean returned = false;\n  // TODO: Constructor, isOverdue(), returnBook()\n}\n\n// Generic Repository\nclass Repository<T> {\n  private Map<String, T> store = new HashMap<>();\n  // TODO: add, findById, findAll, remove, update\n}\n\n// Library Service\npublic class LibraryService {\n  private Repository<Book> books = new Repository<>();\n  private Repository<Member> members = new Repository<>();\n  private List<Loan> loans = new ArrayList<>();\n\n  // TODO: borrowBook, returnBook, searchBooks, generateReport\n\n  public static void main(String[] args) {\n    LibraryService lib = new LibraryService();\n    // Build and test your library system\n  }\n}", xpReward: 80 },
          { id: "java-m14-l3", title: "Testing, Optimization & Code Review", type: "interactive", duration: 35, description: "Test, optimize, and review your capstone project.", content: "Final phase — production-ready code:\n\n1. Testing:\n- Write unit tests for all service methods\n- Test edge cases: empty catalog, double borrow, overdue penalties\n- Verify data persistence save/load cycle\n\n2. Optimization:\n- Profile with appropriate data structures\n- Use HashMap for O(1) lookups by ISBN/ID\n- Optimize stream pipelines with proper short-circuiting\n\n3. Code Review Checklist:\n- Proper encapsulation (no public fields)\n- Meaningful names and clean code\n- Exception handling at every boundary\n- No resource leaks (try-with-resources)\n- Consistent code style\n- Javadoc on public methods\n\n4. Extensions to try:\n- GUI with JavaFX\n- Database backend with JDBC\n- REST API with Spring Boot", codeTemplate: "// Example unit test structure\npublic class LibraryServiceTest {\n  private LibraryService library;\n\n  public void setUp() {\n    library = new LibraryService();\n    // Add sample books and members\n  }\n\n  public void testBorrowBook() {\n    // TODO: Verify book becomes unavailable after borrowing\n  }\n\n  public void testReturnBook() {\n    // TODO: Verify book becomes available after returning\n  }\n\n  public void testSearchByAuthor() {\n    // TODO: Verify search returns correct books\n  }\n\n  public void testOverdueDetection() {\n    // TODO: Verify overdue loans are detected correctly\n  }\n\n  public static void main(String[] args) {\n    LibraryServiceTest test = new LibraryServiceTest();\n    test.setUp();\n    test.testBorrowBook();\n    test.testReturnBook();\n    test.testSearchByAuthor();\n    test.testOverdueDetection();\n    System.out.println(\"All tests passed!\");\n  }\n}", xpReward: 40 },
        ],
        quiz: {
          id: "java-m14-quiz",
          title: "Capstone Review Quiz",
          passingScore: 70,
          xpReward: 65,
          questions: [
            { id: "q1", question: "Which design pattern separates data access from business logic?", options: ["MVC", "Singleton", "DAO (Data Access Object)", "Observer"], correct: 2, explanation: "DAO encapsulates all data access logic, keeping business logic clean and testable." },
            { id: "q2", question: "Why use HashMap for book lookups by ISBN?", options: ["Maintains order", "O(1) average lookup time", "Thread-safe", "Uses less memory"], correct: 1, explanation: "HashMap provides O(1) average time for get operations using hash-based indexing." },
            { id: "q3", question: "What Stream operation checks if any element matches a condition?", options: ["filter()", "findFirst()", "anyMatch()", "forEach()"], correct: 2, explanation: "anyMatch(Predicate) returns true if any element in the stream matches the given predicate." },
          ],
        },
      },
    ],
  },
  {
    id: "web-fullstack",
    title: "Full-Stack Web Development",
    description: "Build modern web apps with React, TypeScript, Node.js, and PostgreSQL.",
    icon: "🌐",
    color: "blue",
    difficulty: "intermediate",
    category: "Full-Stack",
    estimatedHours: 40,
    instructor: "Chadi Troudi",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    modules: [
      {
        id: "web-m1",
        title: "HTML & CSS Mastery",
        description: "Semantic HTML, modern CSS, Flexbox, Grid, and responsive design.",
        icon: "🎨",
        lessons: [
          { id: "web-m1-l1", title: "Semantic HTML5", type: "video", duration: 20, description: "Structure web pages with meaningful HTML elements.", content: "HTML5 introduced semantic elements that give meaning to the structure:\n\n<header> - Page or section header\n<nav> - Navigation links\n<main> - Main content area\n<article> - Independent content\n<section> - Thematic grouping\n<aside> - Sidebar content\n<footer> - Page or section footer\n\nSemantic HTML improves accessibility, SEO, and code readability.", xpReward: 15 },
          { id: "web-m1-l2", title: "Flexbox & Grid Layout", type: "interactive", duration: 30, description: "Master modern CSS layout systems.", content: "Flexbox: One-dimensional layout (row or column)\nGrid: Two-dimensional layout (rows AND columns)\n\nFlexbox is perfect for navigation bars, centering content, and distributing space.\nGrid excels at page layouts, card grids, and complex arrangements.", codeTemplate: ".flex-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}", xpReward: 25 },
          { id: "web-m1-l3", title: "Build a Landing Page", type: "exercise", duration: 45, description: "Create a responsive landing page from scratch.", content: "Apply your HTML & CSS skills to build a modern, responsive landing page with hero section, features grid, testimonials, and footer.", xpReward: 40 },
        ],
        quiz: {
          id: "web-m1-quiz", title: "HTML & CSS Quiz", passingScore: 70, xpReward: 45,
          questions: [
            { id: "q1", question: "Which CSS property creates a flex container?", options: ["flex: 1", "display: flex", "flex-direction: row", "position: flex"], correct: 1, explanation: "'display: flex' creates a flex formatting context." },
            { id: "q2", question: "Which HTML element represents self-contained content?", options: ["<section>", "<div>", "<article>", "<span>"], correct: 2, explanation: "<article> represents independent, self-contained content." },
          ],
        },
      },
      {
        id: "web-m2",
        title: "React & TypeScript",
        description: "Components, hooks, state management, and type-safe development.",
        icon: "⚛️",
        lessons: [
          { id: "web-m2-l1", title: "React Components & JSX", type: "video", duration: 25, description: "Build reusable UI components.", content: "React components are the building blocks of any React application. Components can be function components that return JSX.\n\nJSX looks like HTML but is actually JavaScript. It lets you write UI code in a declarative way.", xpReward: 20 },
          { id: "web-m2-l2", title: "useState & useEffect", type: "interactive", duration: 30, description: "Manage state and side effects.", content: "Hooks are functions that let you use React state and lifecycle features in function components.\n\nuseState: manages component state\nuseEffect: runs side effects (API calls, subscriptions, DOM updates)", codeTemplate: "import { useState, useEffect } from 'react';\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count: {count}\n    </button>\n  );\n};", xpReward: 30 },
          { id: "web-m2-l3", title: "TypeScript for React", type: "slides", duration: 25, description: "Add type safety to your components.", content: "TypeScript enhances React development with compile-time type checking, better IDE support, and self-documenting code.", slides: ["Why TypeScript?", "Typing Props", "Typing State", "Generic Components"], xpReward: 25 },
          { id: "web-m2-l4", title: "Build a Todo App", type: "exercise", duration: 50, description: "Create a full CRUD Todo app.", content: "Build a complete Todo application with add, edit, delete, and filter features using React + TypeScript.", codeTemplate: "interface Todo {\n  id: number;\n  text: string;\n  completed: boolean;\n}\n\nconst TodoApp = () => {\n  const [todos, setTodos] = useState<Todo[]>([]);\n  // Build your app here\n};", xpReward: 50 },
        ],
        quiz: {
          id: "web-m2-quiz", title: "React & TS Quiz", passingScore: 70, xpReward: 55,
          questions: [
            { id: "q1", question: "What hook handles side effects?", options: ["useState", "useEffect", "useContext", "useRef"], correct: 1, explanation: "useEffect handles side effects like API calls." },
            { id: "q2", question: "What does TypeScript add to JavaScript?", options: ["Runtime speed", "Static typing", "New APIs", "Server rendering"], correct: 1, explanation: "TypeScript adds static type checking at compile time." },
          ],
        },
      },
      {
        id: "web-m3",
        title: "Backend with Node.js",
        description: "REST APIs, Express, authentication, and database integration.",
        icon: "🖥️",
        lessons: [
          { id: "web-m3-l1", title: "Node.js & Express", type: "video", duration: 20, description: "Create a server with Express.", content: "Express is a minimal, flexible web framework for Node.js that provides robust features for building web APIs.", xpReward: 20 },
          { id: "web-m3-l2", title: "Building REST APIs", type: "interactive", duration: 35, description: "Design RESTful endpoints.", content: "REST APIs follow conventions: GET (read), POST (create), PUT (update), DELETE (remove).", codeTemplate: "const express = require('express');\nconst app = express();\n\napp.get('/api/users', (req, res) => {\n  res.json(users);\n});\n\napp.post('/api/users', (req, res) => {\n  // Create user\n});", xpReward: 35 },
          { id: "web-m3-l3", title: "Full-Stack Project", type: "exercise", duration: 60, description: "Connect React to Node.js backend.", content: "Build a complete full-stack application with API integration, database, and authentication.", xpReward: 60 },
        ],
        quiz: {
          id: "web-m3-quiz", title: "Backend Quiz", passingScore: 70, xpReward: 50,
          questions: [
            { id: "q1", question: "Which HTTP method updates a resource?", options: ["GET", "POST", "PUT", "DELETE"], correct: 2, explanation: "PUT is used to update/replace resources." },
            { id: "q2", question: "404 status means?", options: ["Success", "Redirect", "Not Found", "Server Error"], correct: 2, explanation: "404 means the server can't find the requested resource." },
          ],
        },
      },
    ],
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud Engineering",
    description: "Docker, CI/CD pipelines, AWS services, and infrastructure as code.",
    icon: "☁️",
    color: "violet",
    difficulty: "advanced",
    category: "DevOps",
    estimatedHours: 32,
    instructor: "Chadi Troudi",
    tags: ["Docker", "AWS", "CI/CD", "Linux"],
    modules: [
      {
        id: "devops-m1",
        title: "Linux & Bash Scripting",
        description: "Terminal mastery, shell scripting, and system administration.",
        icon: "🐧",
        lessons: [
          { id: "devops-m1-l1", title: "Linux Terminal Essentials", type: "video", duration: 25, description: "Navigate filesystem and manage processes.", content: "Essential commands: ls, cd, cp, mv, rm, grep, find, chmod, chown, ps, top, kill.\n\nFilesystem hierarchy:\n/ - root\n/home - user directories\n/etc - configuration files\n/var - variable data (logs, databases)\n/usr - user programs\n/tmp - temporary files", xpReward: 20 },
          { id: "devops-m1-l2", title: "Bash Scripting", type: "interactive", duration: 35, description: "Automate tasks with shell scripts.", content: "Write shell scripts to automate repetitive system tasks.\n\nBash scripting basics:\n- Variables: NAME=\"value\"\n- Conditionals: if [ condition ]; then ... fi\n- Loops: for, while\n- Functions: function_name() { ... }", codeTemplate: "#!/bin/bash\n# Backup script\nSRC=\"/home/user/data\"\nDEST=\"/backup/$(date +%Y%m%d)\"\nmkdir -p \"$DEST\"\ncp -r \"$SRC\" \"$DEST\"\necho \"Backup complete!\"", xpReward: 30 },
        ],
        quiz: { id: "devops-m1-quiz", title: "Linux Quiz", passingScore: 70, xpReward: 40, questions: [
          { id: "q1", question: "Which lists all files including hidden?", options: ["ls", "ls -l", "ls -a", "dir"], correct: 2, explanation: "'ls -a' shows hidden files (starting with dot)." },
          { id: "q2", question: "Which command changes file permissions?", options: ["chown", "chmod", "chgrp", "perm"], correct: 1, explanation: "'chmod' changes file access permissions." },
        ]},
      },
      {
        id: "devops-m2",
        title: "Docker & Containers",
        description: "Containerize applications with Docker and Docker Compose.",
        icon: "🐳",
        lessons: [
          { id: "devops-m2-l1", title: "Docker Fundamentals", type: "slides", duration: 30, description: "Images, containers, volumes, and networks.", content: "Docker packages applications with their dependencies into portable containers.\n\nKey concepts:\n- Image: read-only template\n- Container: running instance of an image\n- Dockerfile: build instructions\n- Volume: persistent storage\n- Network: container communication", slides: ["What is Docker?", "Images vs Containers", "Dockerfile", "Docker Compose", "Volumes & Networks"], xpReward: 25 },
          { id: "devops-m2-l2", title: "Dockerize a Full-Stack App", type: "exercise", duration: 45, description: "Write Dockerfiles and docker-compose.yml.", content: "Create a multi-container setup with frontend, backend, and database.", codeTemplate: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]", xpReward: 50 },
        ],
        quiz: { id: "devops-m2-quiz", title: "Docker Quiz", passingScore: 70, xpReward: 45, questions: [
          { id: "q1", question: "What file builds a Docker image?", options: ["docker-compose.yml", "Dockerfile", ".dockerignore", "container.json"], correct: 1, explanation: "Dockerfile contains build instructions." },
          { id: "q2", question: "What command runs a container?", options: ["docker build", "docker run", "docker start", "docker exec"], correct: 1, explanation: "'docker run' creates and starts a new container from an image." },
        ]},
      },
      {
        id: "devops-m3",
        title: "CI/CD & AWS Deployment",
        description: "GitHub Actions, AWS EC2/S3, and automated deployments.",
        icon: "🚀",
        lessons: [
          { id: "devops-m3-l1", title: "GitHub Actions CI/CD", type: "video", duration: 30, description: "Automate testing and deployment.", content: "GitHub Actions automates workflows directly in your repository.\n\nWorkflow file structure:\n- name: workflow name\n- on: trigger events (push, pull_request)\n- jobs: groups of steps\n- steps: individual commands or actions", xpReward: 30 },
          { id: "devops-m3-l2", title: "AWS EC2 & S3", type: "interactive", duration: 40, description: "Deploy to AWS cloud.", content: "EC2 provides virtual servers, S3 provides object storage.\n\nEC2 basics:\n- Launch an instance (choose AMI, instance type)\n- Configure security groups\n- Connect via SSH\n\nS3 basics:\n- Create buckets\n- Upload objects\n- Set permissions and policies", xpReward: 35 },
          { id: "devops-m3-l3", title: "Deploy to Production", type: "exercise", duration: 50, description: "End-to-end deployment pipeline.", content: "Set up CI/CD from code push to production deployment on AWS.", xpReward: 55 },
        ],
        quiz: { id: "devops-m3-quiz", title: "CI/CD Quiz", passingScore: 70, xpReward: 50, questions: [
          { id: "q1", question: "What does CI stand for?", options: ["Code Integration", "Continuous Integration", "Container Infrastructure", "Cloud Interface"], correct: 1, explanation: "CI = Continuous Integration." },
          { id: "q2", question: "Which AWS service provides virtual servers?", options: ["S3", "EC2", "Lambda", "RDS"], correct: 1, explanation: "EC2 (Elastic Compute Cloud) provides virtual servers." },
        ]},
      },
    ],
  },
  {
    id: "python-data",
    title: "Python for Data Science",
    description: "Python programming, data analysis with Pandas, visualization, and intro to ML.",
    icon: "🐍",
    color: "emerald",
    difficulty: "intermediate",
    category: "Data Science",
    estimatedHours: 28,
    instructor: "Chadi Troudi",
    tags: ["Python", "Pandas", "Data Science", "ML"],
    modules: [
      {
        id: "py-m1",
        title: "Python Essentials",
        description: "Syntax, data structures, functions, and file handling.",
        icon: "📦",
        lessons: [
          { id: "py-m1-l1", title: "Python Syntax & Variables", type: "video", duration: 20, description: "Learn Python's clean syntax.", content: "Python uses indentation to define code blocks. No semicolons or curly braces needed.\n\nPython philosophy: readability counts, explicit is better than implicit.\n\nVariables:\n- No type declaration needed\n- Dynamic typing\n- Snake_case naming convention", xpReward: 15 },
          { id: "py-m1-l2", title: "Lists, Dicts & Comprehensions", type: "interactive", duration: 30, description: "Master data structures.", content: "Lists and dictionaries are Python's core data structures.\n\nList: ordered, mutable collection\nDict: key-value pairs\nSet: unique elements\nTuple: immutable list", codeTemplate: "# List comprehension\nsquares = [x**2 for x in range(10)]\nprint(squares)\n\n# Dict comprehension\nword_lengths = {w: len(w) for w in ['hello', 'world']}\nprint(word_lengths)\n\n# Try: Filter even squares only", xpReward: 25 },
          { id: "py-m1-l3", title: "Functions & Modules", type: "slides", duration: 25, description: "Write reusable code.", content: "Functions promote code reuse and modularity in Python.\n\nDefining functions:\n- def function_name(params):\n- *args for variable positional arguments\n- **kwargs for variable keyword arguments\n- Default parameter values\n- Return multiple values with tuples", slides: ["Defining Functions", "Parameters & Args", "Return Values", "Lambda Functions", "Modules & Imports"], xpReward: 20 },
        ],
        quiz: { id: "py-m1-quiz", title: "Python Quiz", passingScore: 70, xpReward: 40, questions: [
          { id: "q1", question: "How to define a function?", options: ["function myFunc():", "def myFunc():", "fn myFunc():", "func myFunc():"], correct: 1, explanation: "Python uses 'def' for functions." },
          { id: "q2", question: "What is a list comprehension?", options: ["A loop", "Concise list creation", "A class", "A module"], correct: 1, explanation: "List comprehensions create lists concisely from sequences." },
        ]},
      },
      {
        id: "py-m2",
        title: "Data Analysis with Pandas",
        description: "DataFrames, data cleaning, grouping, and analysis.",
        icon: "📊",
        lessons: [
          { id: "py-m2-l1", title: "Pandas DataFrames", type: "video", duration: 30, description: "Work with tabular data.", content: "A DataFrame is a 2D labeled data structure — the core of Pandas.\n\nCreating DataFrames:\n- From dicts: pd.DataFrame({'col1': [1,2], 'col2': [3,4]})\n- From CSV: pd.read_csv('file.csv')\n- From JSON: pd.read_json('file.json')\n\nKey operations:\n- df.head(), df.tail(), df.info()\n- df.describe() for statistics\n- df.shape for dimensions", xpReward: 25 },
          { id: "py-m2-l2", title: "Data Cleaning", type: "interactive", duration: 35, description: "Handle missing values and transformations.", content: "Real-world data is messy. Learn to clean and transform it with Pandas.\n\nCommon cleaning tasks:\n- Handle NaN: dropna(), fillna()\n- Remove duplicates: drop_duplicates()\n- Type conversion: astype()\n- String operations: str.lower(), str.strip()", codeTemplate: "import pandas as pd\n\ndf = pd.read_csv('data.csv')\n\n# Check for missing values\nprint(df.isnull().sum())\n\n# Drop rows with missing values\ndf.dropna(inplace=True)\n\n# Convert types\ndf['price'] = df['price'].astype(float)\n\nprint(df.describe())", xpReward: 30 },
          { id: "py-m2-l3", title: "Analyze a Real Dataset", type: "exercise", duration: 45, description: "End-to-end analysis on real data.", content: "Use Pandas to explore, clean, and analyze a public dataset.\n\nTasks:\n1. Load the dataset\n2. Explore with info(), describe()\n3. Handle missing values\n4. Group and aggregate data\n5. Create visualizations\n6. Draw conclusions", xpReward: 45 },
        ],
        quiz: { id: "py-m2-quiz", title: "Pandas Quiz", passingScore: 70, xpReward: 45, questions: [
          { id: "q1", question: "Which reads a CSV into DataFrame?", options: ["pd.load_csv()", "pd.read_csv()", "pd.open_csv()", "pd.import_csv()"], correct: 1, explanation: "pd.read_csv() reads CSV files." },
          { id: "q2", question: "How to remove missing values?", options: ["df.remove_na()", "df.dropna()", "df.clean()", "df.no_null()"], correct: 1, explanation: "df.dropna() removes rows or columns with missing values." },
        ]},
      },
    ],
  },
];

/* ── RESOURCE LIBRARY ── */

export const resources: Resource[] = [
  { id: "r1", title: "Java Cheat Sheet", type: "pdf", category: "Backend", description: "Quick reference for Java syntax, collections, and OOP patterns.", url: "#", size: "2.4 MB", dateAdded: "2026-01-15", courseId: "java-fundamentals", tags: ["Java", "Reference"] },
  { id: "r2", title: "OOP Design Patterns Notes", type: "notes", category: "Backend", description: "Comprehensive notes on Factory, Singleton, Observer, and Strategy patterns.", url: "#", size: "1.1 MB", dateAdded: "2026-01-20", courseId: "java-fundamentals", tags: ["Java", "Design Patterns"] },
  { id: "r3", title: "Java Collections Masterclass", type: "recording", category: "Backend", description: "Recorded session covering ArrayList, HashMap, TreeSet, and performance.", url: "#", size: "245 MB", dateAdded: "2026-02-01", courseId: "java-fundamentals", tags: ["Java", "Collections"] },
  { id: "r4", title: "React Hooks Deep Dive", type: "pdf", category: "Full-Stack", description: "In-depth guide to useState, useEffect, useContext, useReducer, and custom hooks.", url: "#", size: "3.2 MB", dateAdded: "2026-02-05", courseId: "web-fullstack", tags: ["React", "Hooks"] },
  { id: "r5", title: "TypeScript Best Practices", type: "notes", category: "Full-Stack", description: "Type-safe patterns for React applications.", url: "#", size: "890 KB", dateAdded: "2026-02-10", courseId: "web-fullstack", tags: ["TypeScript", "React"] },
  { id: "r6", title: "REST API Design Workshop", type: "recording", category: "Full-Stack", description: "Live workshop on designing scalable REST APIs.", url: "#", size: "380 MB", dateAdded: "2026-02-15", courseId: "web-fullstack", tags: ["Node.js", "API"] },
  { id: "r7", title: "Docker Commands Reference", type: "pdf", category: "DevOps", description: "All essential Docker and Docker Compose commands.", url: "#", size: "1.6 MB", dateAdded: "2026-02-20", courseId: "devops-cloud", tags: ["Docker", "Commands"] },
  { id: "r8", title: "AWS Services Overview", type: "notes", category: "DevOps", description: "EC2, S3, RDS, Lambda, IAM with architecture diagrams.", url: "#", size: "2.8 MB", dateAdded: "2026-02-25", courseId: "devops-cloud", tags: ["AWS", "Cloud"] },
  { id: "r9", title: "CI/CD Pipeline Workshop", type: "recording", category: "DevOps", description: "Build a GitHub Actions pipeline from scratch.", url: "#", size: "410 MB", dateAdded: "2026-03-01", courseId: "devops-cloud", tags: ["CI/CD", "GitHub Actions"] },
  { id: "r10", title: "Python Data Structures", type: "pdf", category: "Data Science", description: "Quick reference for lists, dicts, sets, tuples.", url: "#", size: "1.8 MB", dateAdded: "2026-03-05", courseId: "python-data", tags: ["Python", "Data Structures"] },
  { id: "r11", title: "Pandas Cookbook", type: "notes", category: "Data Science", description: "50+ Pandas code recipes for common tasks.", url: "#", size: "1.5 MB", dateAdded: "2026-03-08", courseId: "python-data", tags: ["Python", "Pandas"] },
  { id: "r12", title: "Data Analysis Live Session", type: "recording", category: "Data Science", description: "Full session analyzing Kaggle datasets.", url: "#", size: "520 MB", dateAdded: "2026-03-10", courseId: "python-data", tags: ["Python", "Data Analysis"] },
  { id: "r13", title: "Git & GitHub Essentials", type: "pdf", category: "Tools", description: "Version control — branching, merging, pull requests.", url: "#", size: "2.1 MB", dateAdded: "2026-01-10", tags: ["Git", "GitHub"] },
  { id: "r14", title: "Clean Code Principles", type: "notes", category: "Best Practices", description: "Key principles from Clean Code for modern development.", url: "#", size: "950 KB", dateAdded: "2026-01-25", tags: ["Clean Code"] },
  { id: "r15", title: "Algorithm Problem Solving", type: "recording", category: "DSA", description: "Walkthrough of 20 algorithm problems with solutions.", url: "#", size: "350 MB", dateAdded: "2026-02-12", tags: ["Algorithms"] },
  { id: "r16", title: "Java Collections & Generics Guide", type: "pdf", category: "Backend", description: "Complete reference for Lists, Maps, Sets, Generics and Wildcards.", url: "#", size: "3.2 MB", dateAdded: "2026-03-15", courseId: "java-fundamentals", tags: ["Java", "Collections", "Generics"] },
  { id: "r17", title: "Streams & Lambdas Cheat Sheet", type: "pdf", category: "Backend", description: "One-page reference covering stream operations, functional interfaces, and method references.", url: "#", size: "1.1 MB", dateAdded: "2026-03-18", courseId: "java-fundamentals", tags: ["Java", "Streams", "Lambdas"] },
  { id: "r18", title: "Java Concurrency Deep Dive", type: "recording", category: "Backend", description: "90-minute session on threads, synchronization, ExecutorService, and CompletableFuture.", url: "#", size: "480 MB", dateAdded: "2026-03-20", courseId: "java-fundamentals", tags: ["Java", "Multithreading", "Concurrency"] },
  { id: "r19", title: "JDBC & Database Access Notes", type: "notes", category: "Backend", description: "Step-by-step guide to JDBC connections, PreparedStatement, transactions, and connection pooling.", url: "#", size: "1.4 MB", dateAdded: "2026-03-22", courseId: "java-fundamentals", tags: ["Java", "JDBC", "Databases"] },
  { id: "r20", title: "Java Design Patterns Handbook", type: "pdf", category: "Backend", description: "Illustrated guide to 12 essential design patterns with Java code examples.", url: "#", size: "4.5 MB", dateAdded: "2026-03-25", courseId: "java-fundamentals", tags: ["Java", "Design Patterns"] },
  { id: "r21", title: "Java Interview Questions", type: "notes", category: "Backend", description: "100+ commonly asked Java interview questions covering OOP, Collections, Streams, and Concurrency.", url: "#", size: "980 KB", dateAdded: "2026-03-28", courseId: "java-fundamentals", tags: ["Java", "Interview Prep"] },
];

/* ── Helpers ── */

export const getCourseById = (id: string) => courses.find(c => c.id === id);
export const getModuleById = (courseId: string, moduleId: string) =>
  getCourseById(courseId)?.modules.find(m => m.id === moduleId);
export const getLessonById = (courseId: string, moduleId: string, lessonId: string) =>
  getModuleById(courseId, moduleId)?.lessons.find(l => l.id === lessonId);
export const getResourcesByCourse = (courseId: string) =>
  resources.filter(r => r.courseId === courseId);

export const lessonTypeConfig: Record<LessonType, { icon: string; label: string; color: string }> = {
  video: { icon: "🎬", label: "Video", color: "text-red-400" },
  slides: { icon: "📑", label: "Slides", color: "text-blue-400" },
  interactive: { icon: "⚡", label: "Interactive", color: "text-yellow-400" },
  exercise: { icon: "💻", label: "Exercise", color: "text-emerald-400" },
};

export const resourceTypeConfig: Record<ResourceType, { icon: string; label: string; color: string; bg: string }> = {
  pdf: { icon: "📄", label: "PDF", color: "text-red-400", bg: "bg-red-500/10" },
  notes: { icon: "📝", label: "Notes", color: "text-blue-400", bg: "bg-blue-500/10" },
  recording: { icon: "🎥", label: "Recording", color: "text-violet-400", bg: "bg-violet-500/10" },
};

export const difficultyConfig: Record<DifficultyLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  intermediate: { label: "Intermediate", color: "text-amber-400", bg: "bg-amber-500/10" },
  advanced: { label: "Advanced", color: "text-red-400", bg: "bg-red-500/10" },
};
